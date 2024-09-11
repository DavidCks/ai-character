import { VRMAvatar, VRMManager } from "@davidcks/r3f-vrm/index";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";
import React from "react";
import { AICharacterManager } from "./AICharacterManager";
import { useFrame } from "@react-three/fiber";
import { Controls } from "./components/Controls";

export type AICharacterProps = {
  vrmUrl?: string;
};

export const AICharacter: React.FC<AICharacterProps> = (props) => {
  const managerRef = React.useRef<AICharacterManager | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [showControls, setShowControls] = React.useState(false);
  const handleLoad = (vrmManager: VRMManager) => {
    vrmManager.focusManager.focus({
      cameraOffset: new Vector3(0, 0, -0.3),
    });
    managerRef.current = new AICharacterManager(vrmManager);
    setShowControls(true);
  };

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
          // setProgress(progress);
        }}
        vrmUrl={props.vrmUrl ?? "aic-runtime-deps/models/Yui.vrm"}
      ></VRMAvatar>
    </>
  );
};
