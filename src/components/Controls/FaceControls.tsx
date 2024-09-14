import React from "react";
import { Slider } from "../common/Slider";
import { ControlsTypeProps } from "./ControlsType";
import useEffect from "react";
import { AICharacterEventListenerType } from "../../AICharacterManager";

const faceEmotions = ["angry", "happy", "relaxed", "sad", "surprised"];

export const FaceControls: React.FC<ControlsTypeProps> = (props) => {
  const [faceEmotionValues, setFaceEmotionValues] = React.useState<{
    [key: string]: number;
  }>({ ...props.manager.vrmManager.expressionManager.face.currentExpression });
  const [faceEmotionIntensity, setFaceEmotionIntensity] = React.useState(
    props.manager.currentFaceEmotionIntensity
  );
  const [intensitySliderEnabled, setIntensitySliderEnabled] =
    React.useState(true);

  React.useEffect(() => {
    const changeListener: AICharacterEventListenerType = (event) => {
      if (event.type === "motion") {
        setFaceEmotionValues({
          ...props.manager.vrmManager.expressionManager.face.currentExpression,
        });
        if (
          props.manager.currentTargetEmotion === "custom" ||
          props.manager.currentTargetEmotion === "neutral"
        ) {
          setIntensitySliderEnabled(false);
        } else {
          setIntensitySliderEnabled(true);
        }
      }
    };
    props.manager.addEventListener("change", changeListener);

    return () => {
      props.manager.removeEventListener("change", changeListener);
    };
  }, []);

  const handleIntensityChange = (value: number) => {
    props.manager.setEmotionIntensity(value);
    setFaceEmotionIntensity(value);
  };

  const handleValueChange = (key: string, value: number) => {
    const newValues = { ...faceEmotionValues, [key]: value };
    props.manager.currentEmotion = "custom";
    const vrmManager = props.manager.vrmManager;
    vrmManager.expressionManager.face.applyExpressions([
      {
        ...newValues,
        duration: 10000,
      },
    ]);
    setFaceEmotionValues(newValues);
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        display: "flex",
        paddingLeft: 8,
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
        }}
      >
        {faceEmotions.map((emotion) => {
          return (
            <Slider
              key={`${emotion}-${props.manager.currentEmotion}`}
              value={faceEmotionValues[emotion] ?? 0}
              labelStart={emotion}
              backgroundColor={props.elementBackgroundColor}
              onChange={(value) => handleValueChange(emotion, value)}
            ></Slider>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        <div
          key={`intensity-slider-${props.manager.currentEmotion}`}
          style={{
            opacity: intensitySliderEnabled ? 1 : 0.5,
          }}
        >
          <Slider
            orientation="vertical"
            onChange={intensitySliderEnabled ? handleIntensityChange : () => {}}
            value={faceEmotionIntensity}
            labelStart={"100%"}
            labelEnd={"0%"}
            backgroundColor={"FAFAFAFF"}
          ></Slider>
        </div>
      </div>
    </div>
  );
};
