import { createStore } from "solid-js/store";
import { Content } from "~/logic/content";
import { Kind } from "~/logic/kind";
import { Rect } from "~/utilities/rect";
import { Uuid } from "~/utilities/uuid";

export const contentsStore = createStore({
  contents: {} as Record<Uuid, Content<Kind>>,
  rects: {} as Record<Uuid, Rect>,
});
