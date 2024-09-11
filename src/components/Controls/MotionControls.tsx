import React from "react";
import { ControlsTypeProps } from "./ControlsType";
import { EmotionAnimationType } from "../../repo/animations/emotions";
import { Slider } from "../common/Slider";
import { FaPlay } from "react-icons/fa6";
import { FaStop } from "react-icons/fa6";
import { Card } from "../common/Card";

export const MotionControls: React.FC<ControlsTypeProps> = (props) => {
  const [playingEmotionAnimation, setPlayingEmotionAnimation] =
    React.useState<string>(props.manager.currentEmotionName);
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>(
    props.manager.currentEmotion
  );
  const [selectedEmotionIntensity, setSelectedEmotionIntensity] =
    React.useState<number>(props.manager.currentEmotionIntensity);
  const [viableEmotionAnimations, setViableEmotionAnimations] = React.useState<
    EmotionAnimationType[]
  >(
    props.manager._getExactViableEmotionAnimations(
      props.manager.currentEmotion,
      props.manager.currentEmotionIntensity
    ) ?? []
  );

  React.useEffect(() => {
    const emotion = props.manager.currentEmotion;
    const intensity = props.manager.currentEmotionIntensity;
    setSelectedEmotion(emotion);
    setSelectedEmotionIntensity(intensity);
    setViableEmotionAnimations(
      props.manager._getExactViableEmotionAnimations(emotion, intensity) ?? []
    );
  }, [props.manager.currentEmotion, props.manager.currentEmotionIntensity]);

  const handleEmotionIntensityChange = (value: number) => {
    setSelectedEmotionIntensity(value);
    props.manager.setEmotionIntensity(value);
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
        {viableEmotionAnimations.map((emotion: EmotionAnimationType) => {
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
                    props.manager.setEmotion("neutral", emotion.intensity);
                  }
                },
              }}
            ></Card>
          );
        })}
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
          value={selectedEmotionIntensity}
          labelStart={"100%"}
          labelEnd={"0%"}
          backgroundColor={"FAFAFAFF"}
        ></Slider>
      </div>
    </div>
  );
};
