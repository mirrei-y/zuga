import { JSX } from "solid-js";
import { defaultOtherProps, shapeProps, svgs } from "./meta";
import { Pos } from "./pos";
import { Kind, OtherProps, ShapeProps } from "./props";

export const shapeProp = <K extends Kind>(kind: K, points: Pos[]): ShapeProps[K] => {
  return shapeProps[kind](points);
}

export const defaultOtherProp = <K extends Kind>(kind: K): OtherProps[K] => {
  return defaultOtherProps[kind];
}

export const svg = <K extends Kind>(kind: K, shape: ShapeProps[K], other: OtherProps[K]): JSX.Element => {
  return svgs[kind](shape, other);
};
