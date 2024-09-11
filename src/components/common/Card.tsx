import React from "react";
import { IconType } from "react-icons";
import { IconButton, IconButtonProps } from "./IconButton";

export type CardProps = {
  title: string;
  subtitle: string;
  body: string;
  borderRadius: number;
  backgroundColor: string;
  icon: IconButtonProps;
};

export const Card: React.FC<CardProps> = (props) => {
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
        fontSize: "7pt",
      }}
    >
      {/* Main Div */}
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {/* Title Div */}
        <div
          style={{
            position: "relative",
            left: 0,
            right: 0,
            top: "-14px",
            textAlign: "left",
            textShadow: `0px 0px 4px ${props.backgroundColor}`,
          }}
        >
          {props.title}
        </div>
        {/* Card Body Div */}
        <div
          style={{
            display: "flex",
            flex: 3,
            flexDirection: "column",
            marginTop: "-12px",
          }}
        >
          <span style={{ fontSize: "6pt", opacity: 0.75 }}>
            {props.subtitle}
          </span>
          <span
            style={{
              fontSize: "4pt",
              wordWrap: "anywhere" as any,
            }}
          >
            {props.body}
          </span>
        </div>
      </div>
      {/* Card Icon Div */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          paddingRight: "4px",
          paddingLeft: "4px",
        }}
      >
        <IconButton {...props.icon} />
      </div>
    </div>
  );
};
