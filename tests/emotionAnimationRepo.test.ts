// emotionAnimationRepo.test.ts

import {
  emotionAnimations,
  EmotionAnimationMetadataType,
} from "../src/repo/animations/emotions";

import { animationRepo } from "../src/repo/animations/repo";
import { interactionAnimations } from "../src/repo/animations/interactions";
import { test, expect } from "bun:test";
import { InteractionAnimationMetadataType } from "../../ai-vrm-chat/dist/ai-character/src/repo/animations/interactions";

// Helper function to extract the emotion, intensity, and index from the animation reference
function extractEmotionAnimationPath(animation: any) {
  if (animation.metaType === "motion") {
    let emotion = animation.emotion;
    let intensity = animation.intensity;
    let index = emotionAnimations[emotion][intensity].indexOf(animation);

    return { emotion, intensity, index };
  }
  // If it's an interaction, return null for intensity and index
  return { emotion: animation.emotion, intensity: null, index: null };
}

test("emotionAnimationRepo validity tests", () => {
  for (const [key, animation] of Object.entries(animationRepo)) {
    const { emotion, intensity, index } =
      extractEmotionAnimationPath(animation);

    if (animation.metaType === "motion") {
      const emotionAnimation = animation as EmotionAnimationMetadataType;
      // Check if the emotion exists in emotionAnimations
      expect(emotionAnimations[emotion]).toBeDefined();

      // Check if the intensity exists in emotionAnimations
      expect(emotionAnimations[emotion][intensity]).toBeDefined();

      // Check if the index exists and matches the animation
      expect(emotionAnimations[emotion][intensity][index!]).toEqual(
        emotionAnimation
      );
    } else if (animation.metaType === "interaction") {
      const interactionAnimation =
        animation as InteractionAnimationMetadataType;
      // Check if the interaction animation exists in interactionAnimations
      expect(interactionAnimations[animation.key]).toEqual(
        interactionAnimation
      );
    }
  }
});
