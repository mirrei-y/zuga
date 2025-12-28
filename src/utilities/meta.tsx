import { JSX } from "solid-js";
import { NumberConstraint } from "./numberConstraint";
import { Pos } from "./pos";
import { Kind, OtherProps, ShapeProps } from "./props";

export const readables: Record<Kind, string> = {
  "rectangle": "Rectangle",
  "ellipse": "Ellipse",
  "line": "Line",
  "text": "Text",
};

export const requirePoints: Record<Kind, NumberConstraint> = {
  "rectangle": { exact: 2 },
  "ellipse": { exact: 2 },
  "line": { min: 2 },
  "text": { exact: 1 },
};

export const shapeProps: { [K in Kind]: (props: Pos[]) => ShapeProps[K] } = {
  "rectangle": (points: Pos[]) => {
    const x = Math.min(points[0].x, points[1].x);
    const y = Math.min(points[0].y, points[1].y);
    const width = Math.abs(points[1].x - points[0].x);
    const height = Math.abs(points[1].y - points[0].y);
    return { x, y, width, height };
  },
  "ellipse": (points: Pos[]) => {
    const x1 = points[0].x;
    const y1 = points[0].y;
    const x2 = points[1].x;
    const y2 = points[1].y;
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, rx: Math.abs(x2 - x1) / 2, ry: Math.abs(y2 - y1) / 2 };
  },
  "line": (points: Pos[]) => {
    return { points };
  },
  "text": (points: Pos[]) => {
    return { x: points[0].x, y: points[0].y };
  },
};

export const defaultOtherProps: { [K in Kind]: OtherProps[K] } = {
  "rectangle": { color: "transparent", strokeColor: "black", strokeWidth: 2 },
  "ellipse": { color: "transparent", strokeColor: "black", strokeWidth: 2 },
  "line": { color: "black", strokeWidth: 2 },
  "text": { content: "Text", fontSize: 16, color: "black" },
};

export const svgs: { [K in Kind]: (shape: ShapeProps[K], other: OtherProps[K]) => JSX.Element } = {
  "rectangle": (s, o) => (
    <rect
      x={s.x}
      y={s.y}
      width={s.width}
      height={s.height}
      fill={o.color}
      stroke={o.strokeColor}
      stroke-width={o.strokeWidth}
    />),
  "ellipse": (s, o) => (
    <ellipse
      cx={s.cx}
      cy={s.cy}
      rx={s.rx}
      ry={s.ry}
      fill={o.color}
      stroke={o.strokeColor}
      stroke-width={o.strokeWidth} />),
  "line": (s, o) => (
    <polyline
      points={s.points.map(pt => `${pt.x},${pt.y}`).join(' ')}
      fill="none"
      stroke={o.color}
      stroke-width={o.strokeWidth}
    />
  ),
  "text": (s, o) => <text x={s.x} y={s.y} font-size={o.fontSize + 'px'} fill={o.color}>{o.content}</text>,
};
