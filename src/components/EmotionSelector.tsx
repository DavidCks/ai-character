import { FaFaceGrinHearts } from "react-icons/fa6";
import { FaFaceAngry } from "react-icons/fa6";
import { FaFaceFlushed } from "react-icons/fa6";
import { FaFaceFrown } from "react-icons/fa6";
import { FaFaceFrownOpen } from "react-icons/fa6";
import { FaFaceGrin } from "react-icons/fa6";
import { FaFaceGrinBeam } from "react-icons/fa6";
import { FaFaceGrinBeamSweat } from "react-icons/fa6";
import { FaFaceKissWinkHeart } from "react-icons/fa6";
import { FaFaceGrinStars } from "react-icons/fa6";
import { FaFaceGrinSquint } from "react-icons/fa6";
import { FaFaceGrinTears } from "react-icons/fa6";
import { FaFaceMeh } from "react-icons/fa6";
import { FaFaceRollingEyes } from "react-icons/fa6";
import { FaFaceSadTear } from "react-icons/fa6";
import { FaFaceSurprise } from "react-icons/fa6";
import { FaFaceTired } from "react-icons/fa6";
import { FaFaceSadCry } from "react-icons/fa6";
import { FaFaceSmile } from "react-icons/fa6";
import { FaFaceMehBlank } from "react-icons/fa6";
import { FaFaceGrimace } from "react-icons/fa6";
import { FaFaceGrinTongue } from "react-icons/fa6";
import { FaFaceLaugh } from "react-icons/fa6";
import { FaFaceLaughBeam } from "react-icons/fa6";
import { FaFaceLaughWink } from "react-icons/fa6";
import { FaFaceDizzy } from "react-icons/fa6";
import { FaSort } from "react-icons/fa6";
import { emotions } from "../repo/animations/emotions";
import { IconType } from "react-icons";
import { IconButton } from "./common/IconButton";
import { useState, useCallback } from "react";
import { AICharacterManager } from "../AICharacterManager";
import { FaceExpression } from "piper-wasm/expressions";

const emotionIconMap: {
  [key: keyof typeof emotions]: {
    icon: IconType;
    angle: number;
    label: string;
  };
} = {
  admiration: { icon: FaFaceGrinStars, angle: 0, label: "admiring" },
  amusement: { icon: FaFaceLaughWink, angle: 0, label: "amused" },
  anger: { icon: FaFaceAngry, angle: 0, label: "angry" },
  annoyance: { icon: FaFaceTired, angle: 0, label: "annoyed" },
  approval: { icon: FaFaceSmile, angle: 0, label: "approving" },
  caring: { icon: FaFaceKissWinkHeart, angle: 0, label: "caring" },
  confusion: { icon: FaFaceSmile, angle: 180, label: "confused" },
  curiosity: { icon: FaFaceSurprise, angle: 0, label: "curious" },
  desire: { icon: FaFaceGrinTongue, angle: 0, label: "desiring" },
  disappointment: { icon: FaFaceRollingEyes, angle: 0, label: "disappointed" },
  disapproval: { icon: FaFaceMeh, angle: 0, label: "disapproving" },
  disgust: { icon: FaFaceGrimace, angle: 0, label: "disgusted" },
  embarrassment: { icon: FaFaceMehBlank, angle: 0, label: "embarrased" },
  excitement: { icon: FaFaceLaughBeam, angle: 0, label: "excited" },
  fear: { icon: FaFaceFrownOpen, angle: 0, label: "fearful" },
  gratitude: { icon: FaFaceGrin, angle: 0, label: "gracious" },
  grief: { icon: FaFaceSadCry, angle: 0, label: "grieving" },
  joy: { icon: FaFaceGrinSquint, angle: 0, label: "happy" },
  love: { icon: FaFaceGrinHearts, angle: 0, label: "loving" },
  nervousness: { icon: FaFaceGrinBeamSweat, angle: 0, label: "nervous" },
  optimism: { icon: FaFaceLaugh, angle: 0, label: "optimistic" },
  pride: { icon: FaFaceGrinBeam, angle: 0, label: "proud" },
  realization: { icon: FaFaceFlushed, angle: 0, label: "realizing" },
  relief: { icon: FaFaceGrinTears, angle: 0, label: "relieved" },
  remorse: { icon: FaFaceFrown, angle: 0, label: "remorseful" },
  sadness: { icon: FaFaceSadTear, angle: 0, label: "sad" },
  surprise: { icon: FaFaceDizzy, angle: 0, label: "surprised" },
};

export type EmotionSelectorProps = {
  borderRadius: number;
  selectedEmotion: string;
  onEmotionChanged: (emotion: string) => void;
  manager: AICharacterManager;
};

export const EmotionSelector: React.FC<EmotionSelectorProps> = (props) => {
  const [alphabetOrdering, setAlphabetOrdering] = useState<boolean>(true);

  const handleEmotionChange = useCallback(
    (selectedEmotion: string) => {
      props.manager.setEmotion(selectedEmotion);
      if (props.onEmotionChanged) {
        props.onEmotionChanged(selectedEmotion);
      }
    },
    [props.onEmotionChanged, props.manager]
  );

  return (
    <div
      style={{
        padding: 4,
        backgroundColor: "#C9C9C9BB",
        borderRadius: props.borderRadius,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          height: "12px",
          paddingBottom: 2,
          alignItems: "center",
        }}
      >
        <FaSort size={10} />
        <button
          onClick={() => {
            setAlphabetOrdering(true);
          }}
          style={{
            cursor: "pointer",
            padding: 0,
            border: "none",
            fontSize: "4pt",
            backgroundColor: "transparent",
            textDecoration: alphabetOrdering ? "underline" : "none",
          }}
        >
          Alphabet
        </button>
        <button
          onClick={() => {
            setAlphabetOrdering(false);
          }}
          style={{
            cursor: "pointer",
            padding: 0,
            border: "none",
            fontSize: "4pt",
            backgroundColor: "transparent",
            textDecoration: !alphabetOrdering ? "underline" : "none",
          }}
        >
          Sentiment
        </button>
      </div>
      <div
        style={{
          borderTop: "1px solid #49494988",
          height: "calc(100% - 11px)",
          overflowY: "auto",
        }}
      >
        <div style={{ height: "4px" }}></div>
        <div
          style={{
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {Object.keys(alphabetOrdering ? emotionIconMap : emotions)
            .filter((s) => s !== "neutral")
            .map((key) => {
              const entry = emotionIconMap[key];
              if (!entry) {
                return <div key={key}></div>;
              }
              const { icon, angle, label } = emotionIconMap[key];
              return (
                <IconButton
                  key={key}
                  label={label}
                  icon={icon}
                  iconSize={24}
                  iconColor={
                    key === props.selectedEmotion ? "#494949FF" : "#49494988"
                  }
                  backgroundColor={
                    key === props.selectedEmotion ? "#FAFAFAFF" : "#FAFAFA88"
                  }
                  radius={14}
                  rotation={angle}
                  onClick={() => handleEmotionChange(key)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
