import { Kind, OtherProps, ShapeProps } from "./props";

export type Content = {
  [K in Kind]: {
    uuid: string;
    kind: K;
    shapeProps: ShapeProps[K];
    otherProps: OtherProps[K];
  }
}[Kind];
