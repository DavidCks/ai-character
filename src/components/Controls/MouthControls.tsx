import React from "react";
import { ControlsTypeProps } from "./ControlsType";
import { IconButton } from "../common/IconButton";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { VoiceNames } from "../../repo/voices";
import { Card } from "../common/Card";
import { FaceExpression } from "piper-wasm/expressions";

export const MouthControls: React.FC<ControlsTypeProps> = (props) => {
  const [ttsProgress, setTtsProgress] = React.useState(-1);
  const [messages, setMessages] = React.useState<
    Awaited<ReturnType<typeof props.manager.say>>[]
  >([]);
  const [selectedVoice, setSelectedVoice] = React.useState<
    VoiceNames | undefined
  >();
  const inputRef = React.useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    const input = inputRef?.current;
    if (!input) {
      return;
    }
    setTtsProgress(0);
    const inputText = input.innerText;
    const generatedResponse = await props.manager.prompt(inputText);
    const audioData = await props.manager.say(
      generatedResponse,
      selectedVoice,
      (p) => {
        setTtsProgress(p);
      }
    );
    input.innerHTML = "";
    setMessages([...messages, audioData]);
    audioData.audio.addEventListener("ended", () => {
      setTtsProgress(-1);
    });
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
      }}
    >
      {/* main div */}
      <div
        style={{
          display: "flex",
          padding: "4px",
          height: "calc(100% - 8px)",
          flexDirection: "column",
        }}
      >
        {/* messages div */}
        <div
          style={{
            display: "flex",
            flex: "3",
            gap: "8px",
            marginBottom: "4px",
            paddingTop: "6px",
            paddingRight: "12px",
            maxHeight: "66%",
            overflowX: "hidden",
            overflowY: "auto",
            flexDirection: "column",
          }}
        >
          {messages.map((messageData) => {
            const faceExpressions = messageData.data.expressions
              .faceExpressions as FaceExpression[];
            const emotion = faceExpressions[0].emotion;
            const score = new String(faceExpressions[0].emotionScore).substring(
              0,
              4
            );
            const duration = messageData.data.duration;
            const metadata = `duration: ${duration}`;
            return (
              <div key={messageData.data.file}>
                <Card
                  title={`${emotion} | ${score}`}
                  body={`${messageData.data.input} | ${metadata}`}
                  borderRadius={props.borderRadius}
                  backgroundColor={props.elementBackgroundColor}
                  icon={{
                    icon: FaDownload,
                    iconSize: 14,
                    radius: 48,
                    backgroundColor: props.backgroundColor,
                    iconColor: "black",
                    onClick: () => {
                      const inputSubstring = messageData.data.input.substring(
                        0,
                        6
                      );
                      const fileName = `${inputSubstring}-${emotion}-${score}.wav`;
                      const link = document.createElement("a");
                      link.href = messageData.data.file;
                      link.download = fileName;
                      link.click();
                    },
                  }}
                ></Card>
              </div>
            );
          })}
        </div>
        {/* chat controls div */}
        <div
          style={{
            display: "flex",
            flex: "1",
            gap: "4px",
            flexDirection: "row",
          }}
        >
          {/* chat text input div */}
          <div
            style={{
              display: "flex",
              position: "relative",
              flex: "9",
            }}
          >
            <div
              ref={inputRef}
              style={{
                width: "100%",
                borderRadius: props.borderRadius,
                background: props.elementBackgroundColor,
                padding: "4px",
                fontSize: "7pt",
              }}
              contentEditable
            ></div>
            {/* progress indicator */}
            {ttsProgress >= 0 && (
              <div
                style={{
                  position: "absolute",
                  borderRadius: "48px",
                  margin: "8px",
                  top: "0",
                  bottom: "0",
                  right: "0",
                  width: "8px",
                  background: "#39393922",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    borderRadius: "48px",
                    bottom: "0",
                    right: "0",
                    left: "0",
                    maxHeight: "100%",
                    transition: "height 1.5s cubic-bezier(.41,.19,.2,.92)",
                    height: `${ttsProgress}%`,
                    background: "#393939",
                  }}
                ></div>
              </div>
            )}
          </div>
          {/* chat send, next, prev controls */}
          <div
            style={{
              display: "flex",
              flex: "1",
              gap: "4px",
              flexDirection: "column",
            }}
          >
            <IconButton
              radius={48}
              iconSize={18}
              backgroundColor={props.elementBackgroundColor}
              icon={FaArrowCircleUp}
              onClick={handleSend}
            ></IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
