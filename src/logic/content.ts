import { OtherProps } from "./meta/otherProps";
import { ShapeProps } from "./meta/shapeProps";
import { Kind } from "./kind";

export type Content = {
  [K in Kind]: {
    uuid: `${string}-${string}-${string}-${string}-${string}`;
    kind: K;
    shapeProps: ShapeProps[K];
    otherProps: OtherProps[K];
  };
}[Kind];

export function defineContent<T extends Content>(content: T): T {
  return content;
}
