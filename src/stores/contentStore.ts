import { createStore } from "solid-js/store";
import { Content } from "~/utilities/content";

export const contentStore = createStore({
  content: [] as Content[],
});
