import { JSX } from "solid-js";
import { Kind } from "../kind";

export const thumbnails: Record<Kind, JSX.Element> = {
  rectangle: (
    <svg width="40" height="40">
      <rect
        x="5"
        y="5"
        width="30"
        height="30"
        fill="transparent"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  ellipse: (
    <svg width="40" height="40">
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="15"
        fill="transparent"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  line: (
    <svg width="40" height="40">
      <line
        x1="5"
        y1="35"
        x2="35"
        y2="5"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  text: (
    <svg width="40" height="40">
      <text
        x="20"
        y="32.5"
        text-anchor="middle"
        font-size="35"
        fill="currentColor"
      >
        A
      </text>
    </svg>
  ),
  math: (
    <svg width="40" height="40">
      <text
        x="20"
        y="32.5"
        text-anchor="middle"
        font-size="35"
        fill="currentColor"
      >
        ∑
      </text>
    </svg>
  ),
};
