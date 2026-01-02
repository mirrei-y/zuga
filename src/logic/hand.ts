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
  pan: {
    mode: "pan";
  };
};

export type Hand = Hands[Mode];

export const defaultHand = <M extends Mode>(mode: M): Hands[M] => {
  switch (mode) {
    case "draw":
      return {
        mode: "draw",
        kind: "rectangle",
        points: [] as WorldPos[],
      } as Hands[M];
    case "select":
      return {
        mode: "select",
        selecteds: [] as Uuid[],
        rect: null,
      } as Hands[M];
    case "pan":
      return { mode: "pan" } as Hands[M];
  }
};
