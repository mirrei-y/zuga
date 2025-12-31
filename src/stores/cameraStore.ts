import { createStore } from "solid-js/store";
import { asWorldPos } from "../utilities/pos";

export const cameraStore = createStore({
  center: asWorldPos({ x: 0, y: 0 }),
  scale: 1,
});
