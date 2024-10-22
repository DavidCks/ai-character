import { AnimationMetadataType } from "./AnimationMetadataType";

export interface InteractionAnimationMetadataType
  extends AnimationMetadataType {}

export const interactionAnimations: {
  [key: string]: InteractionAnimationMetadataType;
} = {
  bored: {
    metaType: "interaction",
    emotion: "neutral",
    name: "Bored",
    intensity: 1,
    key: "bored",
    url: "aic-runtime-deps/animations/interactions/Bored.fbx",
    motion: "ArmsSwinging+SwayingForwardAndBack",
    type: "fbx",
  },
  kiss: {
    metaType: "interaction",
    name: "Kiss",
    emotion: "love",
    intensity: 1,
    key: "kiss",
    url: "aic-runtime-deps/animations/interactions/Kiss.fbx",
    motion: "KissUp",
    type: "fbx",
  },
  dominantKiss: {
    metaType: "interaction",
    name: "Dominant Kiss",
    emotion: "love",
    intensity: 1,
    key: "dominantKiss",
    url: "aic-runtime-deps/animations/interactions/Dominant_Kiss.fbx",
    motion: "KissDown+HoldingPartnerHip",
    type: "fbx",
  },
  blowAKiss: {
    metaType: "interaction",
    name: "Blow A Kiss",
    emotion: "love",
    intensity: 1,
    key: "blowAKiss",
    url: "aic-runtime-deps/animations/interactions/Blow_A_Kiss.fbx",
    motion: "BlowAKiss",
    type: "fbx",
  },
  blowABigKiss: {
    metaType: "interaction",
    name: "Blow A Big Kiss",
    emotion: "love",
    intensity: 1,
    key: "blowABigKiss",
    url: "aic-runtime-deps/animations/interactions/Blow_A_Big_Kiss.fbx",
    motion: "BlowABigKiss",
    type: "fbx",
  },
  greeting: {
    metaType: "interaction",
    name: "Greeting",
    emotion: "joy",
    intensity: 1,
    key: "greeting",
    url: "aic-runtime-deps/animations/interactions/Standing_Greeting.fbx",
    motion: "Handwave",
    type: "fbx",
  },
  excitedGreeting: {
    metaType: "interaction",
    name: "Excited Greeting",
    emotion: "excitement",
    intensity: 1,
    key: "excitedGreeting",
    url: "aic-runtime-deps/animations/interactions/Hand_Raising.fbx",
    motion: "ExcitedGreeting",
    type: "fbx",
  },
  farAwayWaving: {
    metaType: "interaction",
    name: "Far Away Waving",
    emotion: "excitement",
    intensity: 1,
    key: "farAwayWaving",
    url: "aic-runtime-deps/animations/interactions/Far_Away_Waving.fbx",
    motion: "EnthusiasticWaving",
    type: "fbx",
  },
  farAwayYelling: {
    metaType: "interaction",
    name: "Far Away Yelling",
    emotion: "excitement",
    intensity: 1,
    key: "farAwayYelling",
    url: "aic-runtime-deps/animations/interactions/Standing_Yell.fbx",
    motion: "HunchForward+Yelling",
    type: "fbx",
  },
  sparring: {
    metaType: "interaction",
    name: "Sparring",
    emotion: "anger",
    intensity: 1,
    key: "sparring",
    url: "aic-runtime-deps/animations/interactions/Punching_Bag.fbx",
    motion: "LightBoxing",
    type: "fbx",
  },
  jumpingJacks: {
    metaType: "interaction",
    name: "Jumping Jacks",
    emotion: "neutral",
    intensity: 1,
    key: "jumpingJacks",
    url: "aic-runtime-deps/animations/interactions/Jumping_Jacks.fbx",
    motion: "JumpingJacks",
    type: "fbx",
  },
  burpees: {
    metaType: "interaction",
    name: "Burpees",
    emotion: "neutral",
    intensity: 1,
    key: "burpees",
    url: "aic-runtime-deps/animations/interactions/Burpee.fbx",
    motion: "Burpees",
    type: "fbx",
  },
  squatting: {
    metaType: "interaction",
    name: "Squatting",
    emotion: "neutral",
    intensity: 1,
    key: "squatting",
    url: "aic-runtime-deps/animations/interactions/Air_Squat.fbx",
    motion: "Squatting",
    type: "fbx",
  },
  sillyDance: {
    metaType: "interaction",
    name: "Silly Dance",
    emotion: "joy",
    intensity: 1,
    key: "sillyDance",
    url: "aic-runtime-deps/animations/interactions/Silly_Dancing.fbx",
    motion: "SillyDance",
    type: "fbx",
  },

  looking: {
    metaType: "interaction",
    name: "Looking",
    emotion: "curiosity",
    intensity: 1,
    key: "looking",
    url: "aic-runtime-deps/animations/interactions/Looking.fbx",
    motion: "LookingAhead+HandAboveEyesGivingShadow",
    type: "fbx",
  },
  vibingToMusic: {
    metaType: "interaction",
    name: "Vibing To Music",
    emotion: "joy",
    intensity: 1,
    key: "vibingToMusic",
    url: "aic-runtime-deps/animations/interactions/Cheering.fbx",
    motion: "LightHeadBopping+LightHandBouncing+FingerClenching",
    type: "fbx",
  },
  dancing: {
    metaType: "interaction",
    name: "Dancing",
    emotion: "joy",
    intensity: 1,
    key: "dancing",
    url: "aic-runtime-deps/animations/interactions/Hip_Hop_Dancing.fbx",
    motion: "HipHopDancing",
    type: "fbx",
  },
  spinDancing: {
    metaType: "interaction",
    name: "Spin Dancing",
    emotion: "joy",
    intensity: 1,
    key: "spinDancing",
    url: "aic-runtime-deps/animations/interactions/Northern_Soul_Spin_Combo.fbx",
    motion: "NothernSoulSpinDancing",
    type: "fbx",
  },
  bellyDancing: {
    metaType: "interaction",
    name: "Belly Dancing",
    emotion: "joy",
    intensity: 1,
    key: "bellyDancing",
    url: "aic-runtime-deps/animations/interactions/Bellydancing.fbx",
    motion: "BellyDancing",
    type: "fbx",
  },
  salsaDancing: {
    metaType: "interaction",
    name: "Salsa Dancing",
    emotion: "joy",
    intensity: 1,
    key: "salsaDancing",
    url: "aic-runtime-deps/animations/interactions/Salsa_Dancing.fbx",
    motion: "SalsaDancing",
    type: "fbx",
  },
  yawn: {
    metaType: "interaction",
    name: "Yawn",
    emotion: "relief",
    intensity: 1,
    key: "yawn",
    url: "aic-runtime-deps/animations/interactions/Yawn.fbx",
    motion: "Yawn",
    type: "fbx",
  },
  bBoyDance: {
    metaType: "interaction",
    name: "BBoy Dance",
    emotion: "joy",
    intensity: 1,
    key: "bBoyDance",
    url: "aic-runtime-deps/animations/interactions/Bboy_Uprock.fbx",
    motion: "BboyUprockDance",
    type: "fbx",
  },
  fingerGuns: {
    metaType: "interaction",
    name: "Cool Finger Guns",
    emotion: "pride",
    intensity: 1,
    key: "fingerGuns",
    url: "aic-runtime-deps/animations/interactions/FingerGun.vrma",
    motion: "Finger Gun motion",
    type: "vrma",
  },
  peaceSign: {
    metaType: "interaction",
    name: "Cute Peace Sign",
    emotion: "joy",
    intensity: 1,
    key: "peaceSign",
    url: "aic-runtime-deps/animations/interactions/PeaceSign.vrma",
    motion: "Cute peace sign motion",
    type: "vrma",
  },
  runwayModel: {
    metaType: "interaction",
    name: "Runway Model Showcase",
    emotion: "pride",
    intensity: 1,
    key: "runwayModel",
    url: "aic-runtime-deps/animations/interactions/PeaceSign.vrma",
    motion: "Doing a runway show",
    type: "vrma",
  },
  surpriseWaveGreeting: {
    metaType: "interaction",
    name: "Surprise Wave Greeting",
    emotion: "joy",
    intensity: 1,
    key: "surpriseWaveGreeting",
    url: "aic-runtime-deps/animations/interactions/SurpriseWave.vrma",
    motion: "Popping up from the floor and jumping up to greet",
    type: "vrma",
  },
};
