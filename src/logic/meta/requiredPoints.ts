import { Constraint } from "~/utilities/constraint";
import { Kind } from "../kind";

export const requiredPoints: Record<Kind, Constraint> = {
  rectangle: { exact: 2 },
  ellipse: { exact: 2 },
  line: { min: 2 },
  text: { exact: 1 },
};
