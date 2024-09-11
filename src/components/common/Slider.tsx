import React, { useState, useEffect } from "react";

export type SliderProps = {
  labelStart?: string;
  labelEnd?: string;
  backgroundColor: string;
  orientation?: "horizontal" | "vertical";
  onChange: (value: number) => void;
  value: number;
};

export const Slider: React.FC<SliderProps> = ({
  labelStart,
  labelEnd,
  backgroundColor,
  orientation = "horizontal",
  onChange,
  value = 0,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number((event.target as any).value);
    if (orientation === "vertical") {
      newValue = (newValue - 100) * -1;
    }
    if (onChange) {
      onChange(newValue / 100);
    }
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        borderRadius: "12px",
        border: `7px solid ${backgroundColor}`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: isHorizontal ? "100%" : "auto",
        height: isHorizontal ? "auto" : "100%",
        flexDirection: isHorizontal ? "row" : "column",
      }}
    >
      {/* Left/Top Diamond End */}
      <div
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: "black",
          transform: "rotate(45deg)",
          position: "absolute",
          left: isHorizontal ? "0" : "50%",
          top: isHorizontal ? "50%" : "0",
          transformOrigin: "center",
          marginTop: isHorizontal ? "-1px" : "1px",
          marginLeft: isHorizontal ? "1px" : "-1px",
        }}
      ></div>
      {/* label start */}
      <div
        style={{
          position: "absolute",
          bottom: isHorizontal ? "110%" : "unset",
          top: isHorizontal ? "unset" : "-3px",
          fontSize: "7pt",
          marginRight: isHorizontal ? "unset" : "-320%",
          textShadow: `0px 0px 4px ${backgroundColor}`,
        }}
      >
        {labelStart}
      </div>
      {/* label end */}
      <div
        style={{
          position: "absolute",
          bottom: isHorizontal ? "110%" : "-3px",
          top: isHorizontal ? "unset" : "unset",
          right: isHorizontal ? "0px" : "unset",
          fontSize: "7pt",
          marginRight: isHorizontal ? "unset" : "-320%",
          textShadow: `0px 0px 4px ${backgroundColor}`,
        }}
      >
        {labelEnd}
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={
          isHorizontal
            ? Math.ceil(value * 100)
            : (Math.ceil(value * 100) - 100) * -1
        }
        onChange={handleSliderChange}
        style={{
          flex: 1,
          appearance: "none",
          opacity: 0,
          width: isHorizontal ? "100%" : "8px",
          height: isHorizontal ? "8px" : "100%",
          background: "transparent",
          outline: "none",
          position: "relative",
          zIndex: 1,
          writingMode: isHorizontal ? "horizontal-tb" : "sideways-rl",
        }}
      />

      {/* Right/Bottom Diamond End */}
      <div
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: "black",
          transform: "rotate(45deg)",
          position: "absolute",
          right: isHorizontal ? "1px" : "25%",
          bottom: isHorizontal ? "25%" : "1px",
          transformOrigin: "center",
          marginTop: isHorizontal ? "-1px" : "1px",
        }}
      ></div>

      {/* Custom Slider Track */}
      <div
        style={{
          position: "absolute",
          top: isHorizontal ? "50%" : "5px", // Offset by diamond height for vertical
          left: isHorizontal ? "5px" : "50%", // Offset by diamond width for horizontal
          right: isHorizontal ? "5px" : "50%", // Offset by diamond width for horizontal
          bottom: isHorizontal ? "auto" : "5px", // Offset by diamond height for vertical
          width: isHorizontal ? "auto" : "2px",
          height: isHorizontal ? "2px" : "auto",
          backgroundColor: "black",
          borderRadius: "4px",
        }}
      >
        {/* Custom Slider Ball */}
        <div
          style={{
            position: "absolute",
            left: isHorizontal
              ? `calc(${Math.ceil(value * 100)}% - 5px)`
              : "50%",
            top: isHorizontal
              ? "50%"
              : `calc(${(Math.ceil(value * 100) - 100) * -1}% - 2.5px)`,
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            borderRadius: "50%",
            border: "2px solid black",
            transform: isHorizontal
              ? "translateY(-50%)"
              : "translateX(-50%) translateY(-50%)",
          }}
        ></div>
      </div>
    </div>
  );
};
