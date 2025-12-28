import { createStore } from "solid-js/store";
import { Pos } from "~/utilities/pos";
import { Kind } from "~/utilities/props";

export const drawingStateStore = createStore({
  kind: "rectangle" as Kind,
  points: [] as Pos[],
});
