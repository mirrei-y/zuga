import { createStore } from "solid-js/store";
import { WorldPos } from "~/utilities/pos";
import { Kind } from "~/utilities/props";

export const handStore = createStore({
  kind: "rectangle" as Kind,
  points: [] as WorldPos[],
});
