export type AnimationMetadataType = {
  metaType: "motion" | "interaction";
  emotion: VialbeEmotionType;
  key: string;
  name: string;
  intensity: 1 | 2 | 3;
  url: string;
  motion: string;
  type: "bvh" | "fbx" | "vrma";
};

export type VialbeEmotionType =
  | "love"
  | "joy"
  | "gratitude"
  | "caring"
  | "excitement"
  | "admiration"
  | "optimism"
  | "pride"
  | "amusement"
  | "relief"
  | "approval"
  | "desire"
  | "curiosity"
  | "surprise"
  | "realization"
  | "neutral"
  | "confusion"
  | "embarrassment"
  | "nervousness"
  | "annoyance"
  | "disapproval"
  | "remorse"
  | "fear"
  | "disappointment"
  | "sadness"
  | "anger"
  | "grief"
  | "disgust";
