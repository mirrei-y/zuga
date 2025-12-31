import { createStore } from "solid-js/store";

export const clickStore = createStore<{
  lastClickedAt: number;
}>({
  lastClickedAt: 0,
});
