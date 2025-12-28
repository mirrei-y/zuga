import { createStore } from "solid-js/store";
import { Pos } from "../utilities/pos";

export const cameraStore = createStore({
  center: { x: 0, y: 0 } as Pos,
  scale: 1,
});
