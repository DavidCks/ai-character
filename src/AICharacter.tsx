import { VRMAvatar, VRMManager } from "@davidcks/r3f-vrm/index";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";
import React from "react";
import { AICharacterManager } from "./AICharacterManager";
import { Controls } from "./components/Controls";
import { VoiceNames } from "./repo/voices";
import { emotionAnimations } from "./repo/animations/emotions";

export type AICharacterProps = {
  vrmUrl?: string;
  voiceName?: VoiceNames;
  onLoad?: (manager: AICharacterManager) => void;
  onProgress?: (progress: number) => void;
  showControls?: boolean;
};

export const AICharacter: React.FC<AICharacterProps> = (props) => {
  const managerRef = React.useRef<AICharacterManager | null>(null);
  const [showControls, setShowControls] = React.useState(
    props.showControls ?? false
  );
  const handleLoad = React.useCallback(async (vrmManager: VRMManager) => {
    vrmManager.vrm.scene.visible = false;
    managerRef.current = new AICharacterManager(vrmManager, props.voiceName);

    vrmManager.focusManager.focus({
      cameraOffset: new Vector3(0, 0.0, -0.3),
      lookAtOffset: new Vector3(0, 0.1, 0),
      focusIntensity: 1,
    });
    const chainPromise = managerRef.current.chainManager.prepareChain({
      motionAnimationName: "Surprise Wave Greeting",
      emotion: "joy",
      intensity: 1,
      next: {
        motionAnimationName: "Slight Turn Idle",
        emotion: "joy",
        intensity: 0.1,
        next: {
          motionAnimationName: "Surprise Wave Greeting",
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
    if (props.onLoad) {
      await props.onLoad(managerRef.current);
    }
    await managerRef.current.chainManager.playPreparedChain(chain);
    vrmManager.vrm.scene.visible = true;
  }, []);

  const handleProgress = React.useCallback((progress: number) => {
    if (props.onProgress) {
      props.onProgress(progress);
    }
  }, []);

  return (
    <>
      <Html position={[0, -1, -0.3]} distanceFactor={5} center>
        {showControls && managerRef.current && (
          <Controls manager={managerRef.current}></Controls>
        )}
      </Html>
      <VRMAvatar
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
