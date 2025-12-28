import { JSX } from "solid-js"
import { Kind, OtherProps, ShapeProps } from "./props"

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

export const svg = <K extends Kind>(kind: K, shape: ShapeProps[K], other: OtherProps[K]): JSX.Element => {
  return svgs[kind](shape, other);
};
