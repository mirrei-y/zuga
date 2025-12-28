import { Pos } from "./pos";

export type Kind = keyof ShapeProps | keyof OtherProps;
export const kinds: Kind[] = ["rectangle", "ellipse", "line", "text"];

export type ShapeProps = {
  "rectangle": { x: number; y: number; width: number; height: number; };
  "ellipse": { cx: number; cy: number; rx: number; ry: number; };
  "line": { points: Pos[]; };
  "text": { x: number; y: number; };
};

export type OtherProps = {
  "rectangle": { color: string; strokeColor: string; strokeWidth: number; };
  "ellipse": { color: string; strokeColor: string, strokeWidth: number; };
  "line": { color: string; strokeWidth: number; };
  "text": { content: string; fontSize: number; color: string; };
};
