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
  polygon: (
    <svg width="40" height="40">
      <polygon
        points="20,5 35,35 5,35"
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
  resistor: (
    <svg width="40" height="40">
      <polyline
        points="5,20 10,20 12.5,15 17.5,25 22.5,15 27.5,25 30,20 35,20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  capacitor: (
    <svg width="40" height="40">
      <line
        x1="5"
        y1="20"
        x2="15"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="15"
        y1="10"
        x2="15"
        y2="30"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="25"
        y1="10"
        x2="25"
        y2="30"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="25"
        y1="20"
        x2="35"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  inductor: (
    <svg width="40" height="40">
      <path
        d="M 5 20 L 10 20 Q 12.5 10 15 20 Q 17.5 10 20 20 Q 22.5 10 25 20 Q 27.5 10 30 20 L 35 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  source: (
    <svg width="40" height="40">
      <line
        x1="5"
        y1="20"
        x2="17"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="17"
        y1="10"
        x2="17"
        y2="30"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="23"
        y1="15"
        x2="23"
        y2="25"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="23"
        y1="20"
        x2="35"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  ),
  gnd: (
    <svg width="40" height="40">
      <line
        x1="20"
        y1="5"
        x2="20"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="10"
        y1="20"
        x2="30"
        y2="20"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="13"
        y1="25"
        x2="27"
        y2="25"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="16"
        y1="30"
        x2="24"
        y2="30"
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
