import { createStore } from "solid-js/store";
import { Content } from "~/logic/content";
import { Kind } from "~/logic/kind";

export const clipboardStore = createStore({
  contents: [] as Content<Kind>[],
});
