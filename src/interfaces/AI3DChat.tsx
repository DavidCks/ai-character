import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AICharacter } from "../AICharacter";
import { AICharacterManager } from "../AICharacterManager";
import { Vector3 } from "three";

export const AI3DChat = () => {
  const handleLoad = (manager: AICharacterManager) => {
    manager.vrmManager.focusManager.focus({
      cameraOffset: new Vector3(0, 0.1, -0.3),
      lookAtOffset: new Vector3(0, 0, 0),
    });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Canvas
        camera={{ near: 0.1, far: 100, position: [0, 1, 5] }} // Set the camera position
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <AICharacter onLoad={handleLoad} />
      </Canvas>
    </div>
  );
};
