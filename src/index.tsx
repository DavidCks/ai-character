import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { AICharacter } from "./AICharacter";

const AICharacterCanvas = () => {
  const [count, setCount] = useState(0);

  return (
    <Canvas
      camera={{ near: 0.01, far: 1000, position: [0, 1, 5] }} // Set the camera position
      style={{ height: "800px", width: "100%" }} // Set the height to 800px and width to 100%
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      <Grid
        args={[10, 10]} // Size of the grid
        rotation={[0, 0, 0]} // Rotate to lie on the XZ plane
        position={[0, 0, 0]} // Position the grid at the origin
      />
      <Character />
      <OrbitControls />
    </Canvas>
  );
};

const Character = () => {
  const { scene, camera } = useThree();
  return <AICharacter scene={scene} camera={camera} />;
};

export default Character;

export { AICharacterCanvas };
