import React from "react";
import { IconType } from "react-icons";
import { IconButton, IconButtonProps } from "./IconButton";
/**
 * Props for the Card component.
 *
 * @typedef {Object} CardProps
 * @property {string} title - The title text of the card.
 * @property {string} [subtitle] - The optional subtitle text of the card.
 * @property {string} body - The main body text of the card.
 * @property {number} borderRadius - The border-radius for the card.
 * @property {string} backgroundColor - The background color of the card.
 * @property {IconButtonProps} icon - The props for the IconButton component.
 */
export type CardProps = {
  title: string;
  subtitle?: string;
  body: string;
  borderRadius: number;
  backgroundColor: string;
  icon: IconButtonProps;
};

/**
 * Card component renders a styled card with title, subtitle, body, and an icon.
 *
 * @param {CardProps} props - The properties to render the Card component.
 * @returns {JSX.Element} The rendered Card component.
 *
 * @example
 * <Card
 *   title="Card Title"
 *   subtitle="Optional Subtitle"
 *   body="This is the main content of the card."
 *   borderRadius={8}
 *   backgroundColor="#fafafa"
 *   icon={{ name: 'check', onClick: () => alert('Icon clicked') }}
 * />
 */
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
          {props.subtitle && (
            <span style={{ fontSize: "6pt", opacity: 0.75 }}>
              {props.subtitle}
            </span>
          )}
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
