import { OtherProps } from "./meta/otherProps";
import { ShapeProps } from "./meta/shapeProps";

export type Kind = keyof ShapeProps & keyof OtherProps;
export const kinds: Kind[] = ["rectangle", "ellipse", "line", "text"];
