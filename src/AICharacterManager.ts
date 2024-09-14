import {
  MotionExpression,
  MouthExpression,
  VRMManager,
} from "@davidcks/r3f-vrm";
import { FaceExpression } from "piper-wasm/expressions";
import { LoopOnce } from "three";
import * as THREE from "three";
import { LoopType } from "../../r3f-vrm/src/utils/ExpressionManager";
import {
  emotionAnimations,
  emotions,
  EmotionAnimationType,
} from "./repo/animations/emotions";
import { VoiceNames, VoiceType, voices } from "./repo/voices";
import { piperGenerate, piperPhonemize } from "piper-wasm";

export type AICharacterEventDataType = "motion" | "face" | "mouth";
export type AICharacterEventListenerType = (
  e:
    | {
        type: "motion";
        data: EmotionAnimationType;
      }
    | {
        type: "face";
        data: any;
      }
    | {
        type: "mouth";
        data: any;
      }
) => void;
export type AICharacterEventType = "change";

export class AICharacterManager {
  private _voiceName: VoiceNames;
  private _currentEmotion: string;
  private _currentTargetEmotion: string;
  private _currentEmotionAnimationIntensity: 1 | 2 | 3;
  private _currentFaceEmotionIntensity: number;
  private _currentEmotionAnimationName: string;
  public vrmManager: VRMManager;

  public get voiceName() {
    return this._voiceName;
  }
  public get currentFaceEmotionIntensity() {
    return this._currentFaceEmotionIntensity;
  }
  public get currentEmotion() {
    return this._currentEmotion;
  }
  public get currentEmotionAnimationIntensity() {
    return this._currentEmotionAnimationIntensity;
  }
  public get currentEmotionName() {
    return this._currentEmotionAnimationName;
  }
  public get currentTargetEmotion() {
    return this._currentTargetEmotion;
  }

  public set currentEmotion(emotion: string) {
    this._currentEmotion = emotion;
  }

  constructor(vrmManager: VRMManager, voiceName?: VoiceNames) {
    this.vrmManager = vrmManager;
    this._voiceName = voiceName ?? "yui";
    this._currentEmotion = "neutral";
    this._currentFaceEmotionIntensity = 0.5;
    this._currentEmotionAnimationIntensity = 1;
    this._currentEmotionAnimationName = "none";
    this._currentTargetEmotion = "neutral";
  }

  private _eventListeners: {
    [key: string]: AICharacterEventListenerType[];
  } = {};

  addEventListener(
    type: AICharacterEventType,
    listener: AICharacterEventListenerType
  ) {
    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }
    this._eventListeners[type].push(listener);
  }

  removeEventListener(
    type: AICharacterEventType,
    listener: AICharacterEventListenerType
  ) {
    if (!this._eventListeners[type]) {
      return;
    }
    this._eventListeners[type] = this._eventListeners[type].filter(
      (l) => l !== listener
    );
  }

  /**
   * Sets the emotion of the VRM character by applying a facial expression
   * corresponding to the provided emotion and intensity. If an invalid emotion is
   * provided, the emotion will default to "neutral".
   *
   * @param {string} newEmotion - The emotion to be applied. It should be one of the following values:
   *                              'love', 'joy', 'gratitude', 'caring', 'excitement', 'admiration',
   *                              'optimism', 'pride', 'amusement', 'relief', 'approval', 'desire',
   *                              'curiosity', 'surprise', 'realization', 'neutral', 'confusion',
   *                              'embarrassment', 'nervousness', 'annoyance', 'disapproval', 'remorse',
   *                              'fear', 'disappointment', 'sadness', 'anger', 'grief', 'disgust'.
   * @param {number} intensity - The intensity of the emotion, a value between 0 and 1.
   *                             Higher values represent stronger expressions.
   *
   * @example
   * setEmotion('joy', 0.8);
   * setEmotion('unknownEmotion', 0.5); // Will default to "neutral"
   */
  async setEmotion(
    newEmotion: string,
    intensity?: number,
    faceExpressions?: FaceExpression[]
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let started = false;
      this._currentTargetEmotion = newEmotion;
      intensity ??= this._currentEmotionAnimationIntensity;
      const motionExpressions = await this._getEmotionMotionChain(
        newEmotion,
        intensity
      );
      const newFaceExpressions = faceExpressions ?? [
        FaceExpression.fromDistilbertGoEmotions(
          {
            label: newEmotion,
            score: intensity,
          },
          10000
        ),
      ];
      const expressionsStream = this.vrmManager.expressionManager.express({
        faceExpressions: newFaceExpressions,
        motionExpressions: motionExpressions,
        loopMotion: LoopType.FastForward,
      });
      expressionsStream.subscribe((e: any) => {
        if (!started) {
          resolve(void 0);
          started = true;
        }
        if (e.metadata && e.metadata.metaType === "motion") {
          const motionMetadata = e.metadata as EmotionAnimationType;
          this._currentEmotion = motionMetadata.emotion;
          this._currentEmotionAnimationIntensity = motionMetadata.intensity;
          this._currentEmotionAnimationName = motionMetadata.name;
          // Notify listeners
          if (this._eventListeners["change"]) {
            this._eventListeners["change"].forEach((l) => {
              l({
                type: "motion",
                data: motionMetadata,
              });
            });
          }
        }
      });
    });
  }

  /**
   * Sets the intensity of the current emotion for the VRM character.
   *
   * @param {number} intensity - The new intensity for the current emotion, a value between 0 and 1 or 1 and 3.
   *                             Higher values represent stronger expressions.
   *
   * @example
   * character.setEmotionIntensity(0.9);
   */
  async setEmotionIntensity(intensity: number) {
    const normalizedIntensity = this._normalizeIntensity(intensity);
    if (!this._currentTargetEmotion) {
      console.warn('No current emotion set. Defaulting to "neutral".');
      this._currentTargetEmotion = this._currentEmotion ?? "neutral";
    }
    await this.setEmotion(
      this._currentTargetEmotion,
      normalizedIntensity * 0.332
    );
  }

  async say(
    text: string,
    voiceName?: VoiceNames,
    onProgress?: (arg0: number) => void
  ) {
    // selected voice
    const selectedVoice = voices[voiceName ?? this._voiceName];

    // piper deps
    const piperDepsUrl = "aic-runtime-deps/piper-deps/";
    const piperWorkerUrl = `${piperDepsUrl}piper_worker.js`;
    const piperPhonemizeJsUrl = `piper_phonemize.js`;
    const piperPhonemizeWasmUrl = `piper_phonemize.wasm`;
    const piperPhonemizeDataUrl = `piper_phonemize.data`;
    const onnxRuntimeBaseUrl = `dist/piper-dist/`;
    const expressionWorkerUrl = `${piperDepsUrl}expression_worker.js`;
    const piperData = await piperGenerate(
      piperPhonemizeJsUrl,
      piperPhonemizeWasmUrl,
      piperPhonemizeDataUrl,
      piperWorkerUrl,
      selectedVoice.modelUrl,
      selectedVoice.modelConfigUrl,
      selectedVoice.speakerId ?? null,
      text,
      (p) => {
        onProgress && onProgress(p);
      },
      null,
      true,
      onnxRuntimeBaseUrl,
      expressionWorkerUrl
    );
    const inferredFaceExpressions = piperData.expressions
      .faceExpressions as FaceExpression[];
    const inferredEmotion =
      inferredFaceExpressions.length > 0
        ? inferredFaceExpressions[0].emotion
        : "neutral";
    const inferredEmotionIntensity =
      inferredFaceExpressions.length > 0
        ? inferredFaceExpressions[0].emotionScore
        : 1;
    const inferredMouthExpressions = piperData.expressions
      .mouthExpressions as MouthExpression[];
    const setEmotionPromise = this.setEmotion(
      inferredEmotion,
      inferredEmotionIntensity,
      inferredFaceExpressions.length > 0 ? inferredFaceExpressions : undefined
    );
    await setEmotionPromise;

    const audio = new Audio(piperData.file);
    const startAudioPromise = audio.play();
    await startAudioPromise;

    this.vrmManager.expressionManager.mouth.applyExpressions(
      inferredMouthExpressions
    );
    audio.addEventListener("ended", () => {
      this.vrmManager.expressionManager.mouth.applyExpressions([
        { duration: 1000 },
      ]);
    });
    return { data: piperData, audio };
  }

  async _getEmotionMotionChain(
    emotion: string,
    intensity: number
  ): Promise<MotionExpression<EmotionAnimationType>[]> {
    const normalizedIntensity = this._normalizeIntensity(intensity);
    const closestViableGesture = this._getClosestViableAnimation(
      emotion,
      normalizedIntensity,
      "Gesture"
    );
    const closestViableLoop = this._getClosestViableAnimation(
      emotion,
      normalizedIntensity,
      "Loop"
    );

    const gesturePromise = this.vrmManager.expressionManager.motion.x2motion(
      closestViableGesture.type,
      closestViableGesture.url
    ) as Promise<MotionExpression<EmotionAnimationType>>;
    const loopPromise = this.vrmManager.expressionManager.motion.x2motion(
      closestViableLoop.type,
      closestViableLoop.url
    ) as Promise<MotionExpression<EmotionAnimationType>>;
    const [gesture, loop] = await Promise.all([gesturePromise, loopPromise]);
    gesture.metadata = closestViableGesture;
    loop.metadata = closestViableLoop;
    return [gesture, loop];
  }

  _getNearestEmotion(emotion: string): string {
    const sentiment = emotions[emotion]?.sentiment;
    if (!sentiment) {
      return "neutral";
    }
    const neutralSentiment = emotions["neutral"].sentiment;
    let nearestLowerSentiment: [string, { sentiment: number }] | undefined;
    if (sentiment < neutralSentiment) {
      nearestLowerSentiment = Object.entries(emotions)
        .reverse()
        .find(([_, e]) => e.sentiment > sentiment);
    } else {
      nearestLowerSentiment = Object.entries(emotions)

        .find(([_, e]) => e.sentiment < sentiment);
    }
    return nearestLowerSentiment?.[0] ?? "neutral";
  }

  _getClosestViableAnimation(
    emotion: string,
    intensity: 1 | 2 | 3,
    motionType: "Gesture" | "Loop" = "Loop",
    isFallback = false
  ): EmotionAnimationType {
    const exactEmotionAnimations = this._getExactViableEmotionAnimations(
      emotion,
      intensity
    );
    const exactEmotionAnimationsByType = exactEmotionAnimations?.filter(
      (emotion) =>
        emotion.motionType === motionType &&
        (isFallback ? emotion.useAsFallback : true)
    );
    if (
      exactEmotionAnimationsByType &&
      exactEmotionAnimationsByType.length > 0
    ) {
      const randomIndex = Math.floor(
        Math.random() * exactEmotionAnimationsByType!.length
      );
      return exactEmotionAnimationsByType![randomIndex];
    } else {
      if (intensity === 1) {
        const nearestEmotion = this._getNearestEmotion(emotion);
        const nextBestAnimation = this._getClosestViableAnimation(
          nearestEmotion,
          intensity,
          motionType,
          true
        );
        if (nextBestAnimation) {
          return nextBestAnimation;
        } else {
          const nextNearestEmotion = this._getNearestEmotion(nearestEmotion);
          return this._getClosestViableAnimation(
            nextNearestEmotion,
            intensity,
            motionType,
            true
          );
        }
      } else {
        return this._getClosestViableAnimation(
          emotion,
          (intensity - 1) as 1 | 2 | 3,
          motionType
        );
      }
    }
  }

  /**
   * Sets the animation of the VRM character by applying a motion animation
   * corresponding to the provided emotion, intensity and name. If an invalid emotion is
   * provided, the emotion will default to "neutral".
   *
   * @param {string} animationEmotion - The emotion to be applied. It should be one of the following values:
   *                             'love', 'joy', 'gratitude', 'caring', 'excitement', 'admiration',
   *                            'optimism', 'pride', 'amusement', 'relief', 'approval', 'desire',
   *                           'curiosity', 'surprise', 'realization', 'neutral', 'confusion',
   *                          'embarrassment', 'nervousness', 'annoyance', 'disapproval', 'remorse',
   *                        'fear', 'disappointment', 'sadness', 'anger', 'grief', 'disgust'.
   * @param {number} animationIntensity - The intensity of the emotion, a value between 0 and 1.
   *                            Higher values represent stronger expressions.
   * @param {string} newAnimationName - The name of the animation to be applied.
   */
  async _setAnimation(
    animationEmotion: string,
    animationIntensity: number,
    newAnimationName: string
  ) {
    const viableEmotionAnimations = this._getExactViableEmotionAnimations(
      animationEmotion,
      animationIntensity
    );
    const newEmotionAnimation = viableEmotionAnimations?.find(
      (emotion) => emotion.name === newAnimationName
    )!;
    const newMotionExpression =
      await this.vrmManager.expressionManager.motion.x2motion(
        newEmotionAnimation.type,
        newEmotionAnimation.url
      );
    newMotionExpression.metadata = newEmotionAnimation;
    const animationStream =
      this.vrmManager.expressionManager.motion.applyExpressions(
        [newMotionExpression],
        LoopType.Repeat
      );
    animationStream.subscribe((e: any) => {
      if (e.metadata && e.metadata.metaType === "motion") {
        const motionMetadata = e.metadata as EmotionAnimationType;
        this._currentEmotion = motionMetadata.emotion;
        this._currentEmotionAnimationIntensity = motionMetadata.intensity;
        this._currentEmotionAnimationName = motionMetadata.name;
        // Notify listeners
        if (this._eventListeners["change"]) {
          this._eventListeners["change"].forEach((l) => {
            l({
              type: "motion",
              data: motionMetadata,
            });
          });
        }
      }
    });
  }

  /**
   * Gets viable emotion animations
   * @param {string} emotion one of these strings: 'love', 'joy', 'gratitude', 'caring', 'excitement', 'admiration',
   * 'optimism', 'pride', 'amusement', 'relief', 'approval', 'desire',
   * 'curiosity', 'surprise', 'realization', 'neutral', 'confusion',
   * 'embarrassment', 'nervousness', 'annoyance', 'disapproval', 'remorse',
   * 'fear', 'disappointment', 'sadness', 'anger', 'grief', 'disgust'
   * @param {number} intensity  number between 0 and 1
   *
   * @returns {EmotionAnimationType[] | undefined} an array of viable emotion animations
   */
  _getExactViableEmotionAnimations(
    emotion: string,
    intensity: number
  ): EmotionAnimationType[] | undefined {
    const normalizedIntensity = this._normalizeIntensity(intensity);
    const viableByEmotion = emotionAnimations[emotion]?.[normalizedIntensity];
    return viableByEmotion;
  }

  /**
   * Normalizes intensity
   * @param {number} intensity a number between 0 and 1 or 1 and 3
   * @returns {1 | 2 | 3} 1, 2 or 3. Useful for selecting the correct animation
   *                      based on intensity
   */
  _normalizeIntensity(intensity: number): 1 | 2 | 3 {
    if (intensity < 1) {
      const normalizedIntensity = Math.ceil(intensity * 3);
      const clampedIntensity = Math.min(3, Math.max(1, normalizedIntensity));
      return clampedIntensity as 1 | 2 | 3;
    } else if (intensity >= 3) {
      return 3;
    } else {
      return Math.ceil(intensity) as 1 | 2 | 3;
    }
  }
}
