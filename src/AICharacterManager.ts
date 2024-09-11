import { MotionExpression, VRMManager } from "@davidcks/r3f-vrm";
import { FaceExpression } from "piper-wasm/expressions";
import { LoopOnce } from "three";
import * as THREE from "three";
import {
  emotionAnimations,
  emotions,
  EmotionAnimationType,
} from "./repo/animations/emotions";

export class AICharacterManager {
  public vrmManager: VRMManager;
  public currentEmotion: string;
  public currentEmotionIntensity: number;
  public currentEmotionName: string;

  constructor(vrmManager: VRMManager) {
    this.vrmManager = vrmManager;
    this.currentEmotion = "neutral";
    this.currentEmotionIntensity = 0.5;
    this.currentEmotionName = "none";
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
  async setEmotion(newEmotion: string, intensity?: number) {
    intensity ??= this.currentEmotionIntensity;
    const motionExpressions = await this._getEmotionMotionChain(
      newEmotion,
      intensity
    );
    const newFaceExpression = FaceExpression.fromDistilbertGoEmotions(
      {
        label: newEmotion,
        score: intensity,
      },
      10000
    );
    const expressionsStream = this.vrmManager.expressionManager.express({
      faceExpressions: [newFaceExpression],
      motionExpressions: motionExpressions,
    });
    expressionsStream.subscribe((e: any) => {
      if (e.metadata && Object.keys(e.metadata).includes("motion")) {
        const motionMetadata = e.metadata as EmotionAnimationType;
        this.currentEmotion = motionMetadata.emotion;
        this.currentEmotionIntensity = motionMetadata.intensity;
        this.currentEmotionName = motionMetadata.name;
      }
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
    if (!this.currentEmotion) {
      console.warn('No current emotion set. Defaulting to "neutral".');
      this.currentEmotion = "neutral";
    }
    await this.setEmotion(this.currentEmotion, normalizedIntensity * 0.332);
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

  _getClosestViableAnimation(
    emotion: string,
    intensity: 1 | 2 | 3,
    motionType: "Gesture" | "Loop" = "Loop"
  ): EmotionAnimationType {
    const requestedEmotion = emotions[emotion] ?? emotions["neutral"];
    let closestEmotionAnimationKey: string = "neutral";
    let closestEmotionIntensity: number = 1;
    let closestEmotionSentimentDifference: number = 999;

    // iterate over all animations to find the best match
    const emotionKeys = Object.keys(emotions);
    for (const emotionCandidateIndex in emotionKeys) {
      const emotionCandidateKey = emotionKeys[emotionCandidateIndex];
      const emotionCandidate = emotions[emotionCandidateKey];
      const emotionCandidateSentimentDifference = Math.abs(
        requestedEmotion.sentiment - emotionCandidate.sentiment
      );
      const emotionAnimationCandidatesByIntensity =
        emotionAnimations[emotionCandidateKey];
      if (
        emotionCandidateSentimentDifference <
          closestEmotionSentimentDifference &&
        emotionAnimationCandidatesByIntensity &&
        Object.keys(emotionAnimationCandidatesByIntensity).length > 0
      ) {
        // At this point, there is an emotion animation for the iterated key and it is closer to the desired emotion than neutral
        const flatEmotionAnimationCandidates = Object.entries(
          emotionAnimationCandidatesByIntensity
        )
          .map(([i, e]) => e)
          .flat();
        const emotionAnimationCandidate = flatEmotionAnimationCandidates.filter(
          (e) => e.motionType === motionType && e.intensity === intensity
        );

        if (emotionAnimationCandidate.length > 0) {
          // At this point, the new candidates also match the desired motion type
          closestEmotionSentimentDifference =
            emotionCandidateSentimentDifference;
          closestEmotionAnimationKey = emotionCandidateKey;
          const emotionAnimationCandidatesMatchingIntensity =
            emotionAnimationCandidate.filter((e) => e.intensity === intensity);

          if (emotionAnimationCandidatesMatchingIntensity.length > 0) {
            closestEmotionIntensity = intensity;
          } else {
            const closestAnimationForIntensity =
              emotionAnimationCandidate.reduce((pe, ce) => {
                return pe.intensity > ce.intensity ? ce : pe;
              });
            closestEmotionIntensity = closestAnimationForIntensity.intensity;
          }
        }
      }
    }
    const bestAnimationMatches = emotionAnimations[closestEmotionAnimationKey]![
      closestEmotionIntensity
    ]!.filter((e) => e.motionType === motionType);
    const randomIndex = Math.round(
      Math.random() * (bestAnimationMatches.length - 1)
    );
    const bestAnimationMatch = bestAnimationMatches[randomIndex];
    return bestAnimationMatch;
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
    this.vrmManager.expressionManager.motion.applyExpressions(
      [newMotionExpression],
      THREE.LoopRepeat
    );
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
    const viableByEmotion = Object.keys(emotionAnimations).filter(
      (key) => key === emotion
    );
    if (viableByEmotion.length === 0) {
      return undefined;
    } else {
      return emotionAnimations[viableByEmotion[0]][normalizedIntensity];
    }
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
