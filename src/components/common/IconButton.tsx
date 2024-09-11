import React from "react";
import { IconType } from "react-icons";

export type IconButtonProps = {
  icon?: IconType;
  iconSize?: number;
  iconColor?: string;
  rotation?: number;
  radius?: number;
  label?: string;
  backgroundColor?: string;
  onClick?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  iconSize = 24,
  iconColor,
  rotation = 0,
  radius = 8,
  label,
  backgroundColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: backgroundColor,
        borderRadius: radius,
        border: "none",
        padding: 0,
        outline: "none",
      }}
    >
      {Icon && (
        <Icon
          style={{
            padding: 4,
            transform: `rotate(${rotation}deg)`,
          }}
          size={iconSize}
          color={iconColor}
        />
      )}
      {label && (
        <div
          style={{
            paddingBottom: 4,
            textAlign: "center",
            fontSize: "4pt",
          }}
        >
          {label}
        </div>
      )}
    </button>
  );
};
