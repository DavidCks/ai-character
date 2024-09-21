import React from "react";
import { ControlsTypeProps } from "./ControlsType";
import {
  EmotionAnimationMetadataType,
  emotionAnimations,
} from "../../repo/animations/emotions";
import { Slider } from "../common/Slider";
import { FaPlay } from "react-icons/fa6";
import { FaStop } from "react-icons/fa6";
import { Card } from "../common/Card";
import { AICharacterEventListenerType } from "../../AICharacterManager";

export const MotionControls: React.FC<ControlsTypeProps> = (props) => {
  const [playingEmotionAnimation, setPlayingEmotionAnimation] =
    React.useState<string>(props.manager.currentEmotionName);
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>(
    props.manager.currentEmotion
  );
  const [
    selectedEmotionAnimationIntensity,
    setSelectedEmotionAnimationIntensity,
  ] = React.useState<1 | 2 | 3>(props.manager.currentEmotionAnimationIntensity);
  const [viableEmotionAnimations, setViableEmotionAnimations] = React.useState<
    EmotionAnimationMetadataType[]
  >(
    props.manager._getExactViableEmotionAnimations(
      props.manager.currentEmotion,
      props.manager.currentEmotionAnimationIntensity
    ) ?? []
  );

  React.useEffect(() => {
    const changeListener: AICharacterEventListenerType = (event) => {
      if (event.type === "motion") {
        setPlayingEmotionAnimation(event.data.name);
        setSelectedEmotion(props.manager.currentTargetEmotion);
        setViableEmotionAnimations(
          props.manager._getExactViableEmotionAnimations(
            props.manager.currentTargetEmotion,
            selectedEmotionAnimationIntensity * 0.332
          ) ?? []
        );
      }
    };
    props.manager.addEventListener("change", changeListener);

    return () => {
      props.manager.removeEventListener("change", changeListener);
    };
  }, [selectedEmotionAnimationIntensity]);

  const handleEmotionIntensityChange = (value: number) => {
    const intensity = Math.ceil(value * 3);
    setSelectedEmotionAnimationIntensity(intensity as 1 | 2 | 3);
    setViableEmotionAnimations(
      props.manager._getExactViableEmotionAnimations(
        selectedEmotion,
        value * 0.99
      ) ?? []
    );
    props.manager.setEmotionIntensity(value * 0.99);
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        display: "flex",
        paddingLeft: 8,
        gap: "12px",
        paddingBlock: 8,
        paddingRight: 4,
        flexDirection: "row",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 3,
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          paddingTop: "4px",
          paddingRight: "12px",
          overflowX: "hidden",
        }}
      >
        {viableEmotionAnimations.map(
          (emotion: EmotionAnimationMetadataType) => {
            return (
              <Card
                key={emotion.name}
                title={emotion.name}
                subtitle={emotion.motionType}
                body={emotion.motion}
                borderRadius={8}
                backgroundColor={"#FAFAFAFF"}
                icon={{
                  icon:
                    playingEmotionAnimation === emotion.name ? FaStop : FaPlay,
                  iconSize: 16,
                  iconColor: "#393939FF",
                  radius: 48,
                  backgroundColor: "#D9D9D9",
                  onClick: () => {
                    if (playingEmotionAnimation !== emotion.name) {
                      props.manager._setAnimation(
                        emotion.emotion,
                        emotion.intensity,
                        emotion.name
                      );
                    } else {
                      props.manager._setAnimation(
                        "neutral",
                        1,
                        emotionAnimations["neutral"]![1]![0]!.name
                      );
                    }
                  },
                }}
              ></Card>
            );
          }
        )}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        <Slider
          orientation="vertical"
          onChange={handleEmotionIntensityChange}
          value={selectedEmotionAnimationIntensity * 0.332}
          labelStart={"100%"}
          labelEnd={"0%"}
          backgroundColor={"FAFAFAFF"}
        ></Slider>
      </div>
    </div>
  );
};
