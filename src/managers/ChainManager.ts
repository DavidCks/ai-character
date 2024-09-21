import { LoopType, MotionExpression, MouthExpression } from "@davidcks/r3f-vrm";
import { AICharacterManager } from "../AICharacterManager";
import {
  AnimationMetadataType,
  VialbeEmotionType,
} from "../repo/animations/AnimationMetadataType";
import { emotionAnimations } from "../repo/animations/emotions";
import { interactionAnimations } from "../repo/animations/interactions";
import { Observer } from "rxjs";
import { FaceExpression } from "../../dist/r3f-vrm/src/utils/FaceExpressionManager";
import { FaceExpression as PiperFaceExporession } from "piper-wasm/expressions";

export interface PreparedChain extends Chain {
  next: PreparedChain | null;
  manager: AICharacterManager;
  motionExpression: MotionExpression;
  faceExpression: FaceExpression;
}

/**
 * A chain of animations.
 * @typedef {Object} Chain
 * @property {string} motionAnimationName - The name of the motion animation.
 * @property {Chain|null} [next] - The next chain item or null.
 * @property {AICharacterManager} [manager] - The character manager.
 * @property {VialbeEmotionType} [emotion] - The emotion to be applied. It should be one of the following values:
 *                             'love', 'joy', 'gratitude', 'caring', 'excitement', 'admiration',
 *                            'optimism', 'pride', 'amusement', 'relief', 'approval', 'desire',
 *                           'curiosity', 'surprise', 'realization', 'neutral', 'confusion',
 *                          'embarrassment', 'nervousness', 'annoyance', 'disapproval', 'remorse',
 *                        'fear', 'disappointment', 'sadness', 'anger', 'grief', 'disgust'.
 * @property {number} [duration] - The duration in milliseconds.
 * @property {number} [intensity] - The intensity as a number between 0 and 1.
 * @property {LoopType} [loop] - The loop type. Can be LoopType.Repeat, LoopType.Once, or LoopType.FastForward.
 *
 * @example
 * // Define a chain
 * const chain = {
 *  motionAnimationName: 'walk',
 * next: null,
 * manager: myAICharacterManager,
 * loop: LoopType.FastForward,
 * };
 *
 * // Prepare the chain
 * const preparedChain = await prepareChain(chain);
 *
 * // Play the prepared chain
 * await playPreparedChain(preparedChain);
 */
export type Chain = {
  motionAnimationName: string;
  next: Chain | null;
  manager?: AICharacterManager;
  emotion?: VialbeEmotionType;
  duration?: number;
  intensity?: number;
  loop?: LoopType;
};

export class ChainManager {
  private _manager: AICharacterManager;
  private _animationsByName: Map<string, AnimationMetadataType>;

  constructor(manager: AICharacterManager) {
    this._manager = manager;
    this._animationsByName = new Map();
    for (const key in interactionAnimations) {
      const interaction = interactionAnimations[key];
      if (this._animationsByName.has(interaction.name)) {
        console.warn(
          `Duplicate animation name found: ${interaction.name}. Overwriting.`
        );
      }
      this._animationsByName.set(interaction.name, interaction);
    }
    for (const emotionKey in emotionAnimations) {
      const emotionAimationGroup = emotionAnimations[emotionKey];
      for (const intensityKey in emotionAimationGroup) {
        const emotionAnimationList = emotionAimationGroup[intensityKey];
        for (const emotionAnimation of emotionAnimationList) {
          if (this._animationsByName.has(emotionAnimation.name)) {
            console.warn(
              `Duplicate animation name found: ${emotionAnimation.name}. Overwriting.`
            );
          }
          this._animationsByName.set(emotionAnimation.name, emotionAnimation);
        }
      }
    }
  }

  /**
   * Prepares a chain of animations by resolving motion expressions and recursively processing the next chain items.
   *
   * @param {Chain} item - The chain item to prepare.
   * @returns {Promise<PreparedChain>} A promise that resolves to the prepared chain.
   *
   * @typedef {Object} Chain
   * @property {string} motionAnimationName - The name of the motion animation.
   * @property {Chain|null} [next] - The next chain item or null.
   * @property {AICharacterManager} [manager] - The character manager.
   * @property {LoopType} [loop] - The loop type.
   *
   * @typedef {Object} PreparedChain
   * @property {string} motionAnimationName - The name of the motion animation.
   * @property {MotionExpression} motionExpression - The prepared motion expression.
   * @property {PreparedChain|null} [next] - The next prepared chain item or null.
   * @property {AICharacterManager} manager - The character manager.
   * @property {LoopType} [loop] - The loop type.
   *
   * @example
   * // Define a chain
   * const chain = {
   *   motionAnimationName: 'walk',
   *   next: null,
   *   manager: myAICharacterManager,
   *   loop: LoopType.FastForward,
   * };
   *
   * // Prepare the chain
   * const preparedChain = await prepareChain(chain);
   */
  public async prepareChain(item: Chain): Promise<PreparedChain> {
    const motionAnimation = this._animationsByName.get(
      item.motionAnimationName
    )!;
    const managerInUse = item.manager ?? this._manager;
    const newMotionExpression =
      await managerInUse.vrmManager.expressionManager.motion.x2motion(
        motionAnimation.type,
        motionAnimation.url
      );
    newMotionExpression.duration =
      item.duration ?? newMotionExpression.duration;
    const emotion = item.emotion ?? motionAnimation.emotion;
    const intensity = item.intensity ?? motionAnimation.intensity * 0.332;
    const newFaceExpression = PiperFaceExporession.fromDistilbertGoEmotions(
      {
        score: intensity,
        label: emotion,
      },
      newMotionExpression.duration ??
        Math.round(newMotionExpression.clip.duration * 1000)
    );

    return {
      ...item,
      motionAnimationName: item.motionAnimationName,
      motionExpression: newMotionExpression,
      faceExpression: newFaceExpression,
      next: item.next ? await this.prepareChain(item.next) : null,
      manager: item.manager ?? this._manager,
      loop: item.loop ?? LoopType.FastForward,
    };
  }

  public async playPreparedChain(
    chain: PreparedChain,
    loop: LoopType = LoopType.FastForward
  ) {
    return new Promise(async (resolve, reject) => {
      let started = false;
      let motionExpressions = [chain.motionExpression];
      let faceExpressions = [chain.faceExpression];
      let nextManager = chain.manager ?? this._manager;
      let nextItem = chain.next;
      while (nextItem && nextItem.manager.uid === nextManager.uid) {
        motionExpressions.push(nextItem.motionExpression);
        faceExpressions.push(nextItem.faceExpression);
        nextManager = nextItem.manager;
        nextItem = nextItem.next;
      }
      const expressionsStream = await (
        chain.manager ?? this._manager
      ).vrmManager.expressionManager.express({
        motionExpressions: motionExpressions,
        faceExpressions: faceExpressions,
        loopMotion: loop,
      });
      const observer: Observer<
        MotionExpression<any> | FaceExpression<any> | MouthExpression<any>
      > = {
        next: (e) => {
          if (!started) {
            started = true;
            resolve(void 0);
          }
          (chain.manager ?? this._manager)._onExpressionUpdate(e);
        },
        error: (error) => {
          console.error("An error occurred:", error);
          reject(error);
        },
        complete: () => {
          if (nextItem) {
            this.playPreparedChain(nextItem);
          }
        },
      };
      expressionsStream.subscribe(observer);
    });
  }

  public async playChain(chain: Chain, loop: LoopType = LoopType.FastForward) {
    const preparedChain = await this.prepareChain(chain);
    await this.playPreparedChain(preparedChain, loop);
  }
}
