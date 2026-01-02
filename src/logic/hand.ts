import { Uuid } from "~/utilities/uuid";
import { WorldPos } from "../utilities/pos";
import { Kind } from "./kind";
import { Rect } from "~/utilities/rect";

export type Mode = keyof Hands;
type Hands = {
  draw: {
    mode: "draw";
    kind: Kind;
    points: WorldPos[];
  };
  select: {
    mode: "select";
    selecteds: Uuid[];
    rect: Rect | null;
  };
};

export type Hand = Hands[Mode];

export const defaultHand = <M extends Mode>(mode: M): Hands[M] => {
  if (mode === "draw") {
    return {
      mode: "draw",
      kind: "rectangle",
      points: [] as WorldPos[],
    } as Hands[M];
  } else {
    return {
      mode: "select",
      selecteds: [] as Uuid[],
      rect: null,
    } as Hands[M];
  }
};
