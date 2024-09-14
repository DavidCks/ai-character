import React from "react";
import { IconType } from "react-icons";

/**
 * Props for the IconButton component.
 *
 * @typedef {Object} IconButtonProps
 * @property {IconType} [icon] - The icon component to be rendered inside the button.
 * @property {number} [iconSize=24] - Size of the icon.
 * @property {string} [iconColor] - Color of the icon.
 * @property {number} [rotation=0] - Rotation angle (in degrees) for the icon.
 * @property {number} [radius=8] - Border radius of the button.
 * @property {string} [label] - Optional text label displayed below the icon.
 * @property {string} [backgroundColor] - Background color of the button.
 * @property {Function} [onClick] - Function to be called when the button is clicked.
 */
export type IconButtonProps = {
  icon?: IconType;
  iconSize?: number;
  iconColor?: string;
  rotation?: number;
  radius?: number;
  label?: string;
  backgroundColor?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * IconButton component renders a button with an optional icon and label.
 *
 * @param {IconButtonProps} props - Properties passed to configure the button.
 * @param {IconType} [props.icon] - The icon component to be rendered inside the button.
 * @param {number} [props.iconSize=24] - Size of the icon.
 * @param {string} [props.iconColor] - Color of the icon.
 * @param {number} [props.rotation=0] - Rotation angle (in degrees) for the icon.
 * @param {number} [props.radius=8] - Border radius of the button.
 * @param {string} [props.label] - Optional text label displayed below the icon.
 * @param {string} [props.backgroundColor] - Background color of the button.
 * @param {Function} [props.onClick] - Function to be called when the button is clicked.
 *
 * @returns {JSX.Element} The rendered IconButton component.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  iconSize = 24,
  iconColor,
  rotation = 0,
  radius = 8,
  label,
  backgroundColor,
  onClick,
  ...rest
}) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      style={{
        ...rest.style,
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
