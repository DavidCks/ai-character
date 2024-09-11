import React from "react";
import { AICharacterManager } from "../AICharacterManager";
import { FaFaceMeh } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaKiss } from "react-icons/fa";
import { FaceControls } from "./Controls/FaceControls";
import { ControlsTypeProps } from "./Controls/ControlsType";
import { IconType } from "react-icons";
import { IconButton } from "./common/IconButton";
import { MouthControls } from "./Controls/MouthControls";
import { MotionControls } from "./Controls/MotionControls";
import { EmotionSelector } from "./EmotionSelector";
import { Slider } from "./common/Slider";
import { Vector3 } from "three";
import { StatusDisplay } from "./StatusDisplay";

export const controlMenuMap: {
  [key: string]: {
    icon: IconType;
    controls: React.ComponentType<ControlsTypeProps>;
    onSelected: (manager: AICharacterManager) => void;
  };
} = {
  motion: {
    icon: FaPerson,
    controls: MotionControls,
    onSelected: (manager: AICharacterManager) => {
      manager.vrmManager.focusManager.focus({
        focusIntensity: 0.002,
        cameraOffset: new Vector3(0, 0, -0.8),
      });
    },
  },
  face: {
    icon: FaFaceMeh,
    controls: FaceControls,
    onSelected: (manager: AICharacterManager) => {
      manager.vrmManager.focusManager.focus({
        focusIntensity: 1,
      });
    },
  },
  mouth: {
    icon: FaKiss,
    controls: MouthControls,
    onSelected: (manager: AICharacterManager) => {
      manager.vrmManager.focusManager.focus({
        focusIntensity: 1,
        cameraOffset: new Vector3(0, 0, 0.3),
      });
    },
  },
};

export type ControlsProps = {
  manager: AICharacterManager;
};

export const Controls: React.FC<ControlsProps> = (props) => {
  const [selectedMainMenu, setSelectedMainMenu] =
    React.useState<string>("face");
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>("");
  const containerRadius = 12;

  const handleEmotionChanged = (newSelectedEmotion: string) => {
    setSelectedEmotion(newSelectedEmotion);
  };

  function _buildMainControls() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {Object.keys(controlMenuMap).map((key) => {
          const { icon } = controlMenuMap[key];
          if (key === selectedMainMenu) {
            controlMenuMap[key].onSelected(props.manager);
          }
          return (
            <IconButton
              key={key}
              icon={icon}
              iconSize={24}
              iconColor={key === selectedMainMenu ? "#393939FF" : "#39393988"}
              radius={48}
              backgroundColor={
                key === selectedMainMenu ? "#FAFAFAFF" : "#FAFAFA88"
              }
              onClick={() => setSelectedMainMenu(key)}
            ></IconButton>
          );
        })}
      </div>
    );
  }

  function _buildControls() {
    return (
      <div
        style={{
          height: "200px",
          width: "300px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {_buildMainControls()}
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                height: "calc(100% - 36px)",
                flex: 1,
                display: "flex",
              }}
            >
              <EmotionSelector
                manager={props.manager}
                borderRadius={containerRadius}
                selectedEmotion={selectedEmotion}
                onEmotionChanged={handleEmotionChanged}
              />
            </div>
            <div
              style={{
                height: "calc(100% - 36px)",
                flex: 2,
                display: "flex",
              }}
            >
              {props.manager &&
                selectedMainMenu in controlMenuMap &&
                React.createElement(controlMenuMap[selectedMainMenu].controls, {
                  manager: props.manager,
                  borderRadius: containerRadius,
                  backgroundColor: "#C9C9C9BB",
                  elementBackgroundColor: "#FAFAFAFF",
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {_buildControls()}
      <StatusDisplay
        manager={props.manager}
        containerColor="#C9C9C9BB"
        containerRadius={containerRadius}
      />
    </>
  );
};
