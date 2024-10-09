import { VRMAvatar, VRMManager } from "@davidcks/r3f-vrm/index";
import { Camera, Scene, Vector3 } from "three";
import { Html } from "@react-three/drei";
import React from "react";
import { AICharacterManager } from "./AICharacterManager";
import { Controls } from "./components/Controls";
import { VoiceNames } from "./repo/voices";
import { emotionAnimations } from "./repo/animations/emotions";
import { animationRepo } from "./repo/animations/repo";

/**
 * Props for the AICharacter component.
 *
 * @typedef {Object} AICharacterProps
 * @property {Scene} scene - The scene where the AI character is rendered.
 * @property {Camera} camera - The camera used for rendering the character and controling the focus on the character.
 * @property {string} [vrmUrl] - The URL of the VRM model to load.
 * @property {VoiceNames} [voiceName] - The voice profile to use for the AI character.
 * @property {(manager: AICharacterManager) => void} [onLoad] - Callback fired when the character is loaded.
 *           It will be invisible until the appearance animations have loaded. If you want to how the character
 *           before that, you can set `manager.vrmManager.vrm.scene.visible = true`. It will be in its' default pose though.
 * @property {() => void} [onVisible] - Callback fired when the character becomes visible.
 * @property {(progress: number) => void} [onProgress] - Callback fired to report loading progress.
 * @property {boolean} [showControls] - Flag indicating if the control UI should be shown. This isn't really for you,
 *            more of a thing for me to debug, but it might come in handy for your debugging purposes as well. No guarantee
 *            that it actually works in your environment though. You're probably better off forking the repo
 *            and testing your models through storybook.
 */
export type AICharacterProps = {
  scene: Scene;
  camera: Camera;
  vrmUrl?: string;
  voiceName?: VoiceNames;
  onLoad?: (manager: AICharacterManager) => void;
  onVisible?: () => void;
  onProgress?: (progress: number) => void;
  showControls?: boolean;
};

/**
 * Props for the AICharacter component.
 *
 * @typedef {Object} AICharacterProps
 * @property {Scene} scene - The scene where the AI character is rendered.
 * @property {Camera} camera - The camera used for rendering the character and controling the focus on the character.
 * @property {string} [vrmUrl] - The URL of the VRM model to load.
 * @property {VoiceNames} [voiceName] - The voice profile to use for the AI character.
 * @property {(manager: AICharacterManager) => void} [onLoad] - Callback fired when the character is loaded.
 *           It will be invisible until the appearance animations have loaded. If you want to how the character
 *           before that, you can set `manager.vrmManager.vrm.scene.visible = true`. It will be in its' default pose though.
 * @property {() => void} [onVisible] - Callback fired when the character becomes visible.
 * @property {(progress: number) => void} [onProgress] - Callback fired to report loading progress.
 * @property {boolean} [showControls] - Flag indicating if the control UI should be shown. This isn't really for you,
 *            more of a thing for me to debug, but it might come in handy for your debugging purposes as well. No guarantee
 *            that it actually works in your environment though. You're probably better off forking the repo
 *            and testing your models through storybook.
 */
export const AICharacter: React.FC<AICharacterProps> = (props) => {
  const managerRef = React.useRef<AICharacterManager | null>(null);
  const [showControls, setShowControls] = React.useState(
    props.showControls ?? false
  );
  const handleLoad = React.useCallback(async (vrmManager: VRMManager) => {
    vrmManager.vrm.scene.visible = false;
    managerRef.current = new AICharacterManager(vrmManager, props.voiceName);
    if (props.onLoad) {
      await props.onLoad(managerRef.current);
    }
    vrmManager.focusManager.focus({
      cameraOffset: new Vector3(0, 0.0, -0.3),
      lookAtOffset: new Vector3(0, 0.1, 0),
      focusIntensity: 1,
    });
    const chainPromise = managerRef.current.chainManager.prepareChain({
      motionAnimationName: animationRepo.surpriseWaveGreeting.name,
      emotion: "joy",
      intensity: 1,
      next: {
        motionAnimationName: animationRepo.slightTurnIdle.name,
        emotion: "joy",
        intensity: 0.1,
        next: {
          motionAnimationName: animationRepo.lightBreathing.name,
          emotion: "joy",
          intensity: 1,
          next: null,
        },
      },
    });
    const chain = await chainPromise;
    vrmManager.focusManager.focus({
      cameraOffset: new Vector3(0, 0.0, -0.2),
      focusIntensity: 0.004,
    });
    await managerRef.current.chainManager.playPreparedChain(chain);
    vrmManager.vrm.scene.visible = true;
    props.onVisible && props.onVisible();
  }, []);

  const handleProgress = React.useCallback((progress: number) => {
    if (props.onProgress) {
      props.onProgress(progress);
    }
  }, []);

  return (
    <>
      {showControls && managerRef.current && (
        <Html position={[0, -1, -0.3]} distanceFactor={5} center>
          <Controls manager={managerRef.current}></Controls>
        </Html>
      )}
      <VRMAvatar
        scene={props.scene}
        camera={props.camera}
        prefetchFiles={[]}
        motionExpressionWorkerUrl="aic-runtime-deps/vrm-deps/motion-expression-worker.bundle.js"
        initialPosition={new Vector3(0, 0, 0)}
        onLoad={(vrmManager: VRMManager) => {
          handleLoad(vrmManager);
        }}
        onProgress={(progress: number) => {
          handleProgress(progress);
        }}
        vrmUrl={props.vrmUrl ?? "aic-runtime-deps/models/Yui.vrm"}
      ></VRMAvatar>
    </>
  );
};
