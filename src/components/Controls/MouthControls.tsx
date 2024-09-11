import { ControlsTypeProps } from "./ControlsType";

export const MouthControls: React.FC<ControlsTypeProps> = (props) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
      }}
    >
      MouthControls
    </div>
  );
};
