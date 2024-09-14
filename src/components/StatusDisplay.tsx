import React from "react";
import {
  AICharacterEventListenerType,
  AICharacterManager,
} from "../AICharacterManager";
import useEffect from "react";

export type StatusDisplayProps = {
  manager: AICharacterManager;
  containerRadius: number;
  containerColor: string;
};

export const StatusDisplay: React.FC<StatusDisplayProps> = (props) => {
  const [currentAnimationName, setCurrentAnimationName] =
    React.useState<string>();
  const [currentEmotion, setCurrentEmotion] = React.useState<string>(
    props.manager.currentEmotion
  );
  const [currentEmotionIntensity, setCurrentEmotionIntensity] =
    React.useState<number>(props.manager.currentEmotionAnimationIntensity);
  const [currentTargetEmotion, setCurrentTargetEmotion] =
    React.useState<string>(props.manager.currentTargetEmotion);

  React.useEffect(() => {
    const changeListener: AICharacterEventListenerType = (event) => {
      if (event.type === "motion") {
        setCurrentAnimationName(event.data.name);
        setCurrentEmotion(event.data.emotion);
        setCurrentEmotionIntensity(event.data.intensity);
        setCurrentTargetEmotion(props.manager.currentTargetEmotion);
      }
    };
    props.manager.addEventListener("change", changeListener);

    return () => {
      props.manager.removeEventListener("change", changeListener);
    };
  }, []);

  return (
    <div
      style={{
        paddingInline: "4px",
        height: "50px",
        width: "300px",
        backgroundColor: props.containerColor,
        borderRadius: props.containerRadius,
        fontSize: "7pt",
      }}
    >
      <p>
        {currentTargetEmotion} | {currentEmotion} | {currentEmotionIntensity}
      </p>
      <p>{currentAnimationName}</p>
    </div>
  );
};
