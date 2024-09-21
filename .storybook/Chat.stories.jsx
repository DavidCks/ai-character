import React from "react";
import { AI3DChat } from "../src/interfaces/AI3DChat";

export default {
  title: "3D Chat",
};

export const AIChat = () => (
  <div
    style={{
      height: "calc(100svh - 2rem)",
      width: "calc(100svw - 2rem)",
    }}
  >
    <AI3DChat />
  </div>
);
