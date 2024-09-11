import React from "react";
import { AICharacterManager } from "../AICharacterManager";
import useEffect from "react";

export type StatusDisplayProps = {
  manager: AICharacterManager;
  containerRadius: number;
  containerColor: string;
};

export const StatusDisplay: React.FC<StatusDisplayProps> = (props) => {
  const [currentAnimationName, setCurrentAnimationName] =
    React.useState<string>("");

  React.useEffect(() => {
    setCurrentAnimationName(props.manager.currentEmotionName);
  }, [props.manager.currentEmotionName]);

  return (
    <div
      style={{
        height: "50px",
        width: "300px",
        backgroundColor: props.containerColor,
        borderRadius: props.containerRadius,
      }}
    >
      {currentAnimationName}
    </div>
  );
};
