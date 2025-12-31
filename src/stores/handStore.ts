import { createStore } from "solid-js/store";
import { Hand } from "~/logic/hand";
import { WorldPos } from "~/utilities/pos";
import { Kind } from "~/logic/kind";

export const handStore = createStore({
  mode: "draw",
  kind: "rectangle" as Kind,
  points: [] as WorldPos[],
} as Hand);
