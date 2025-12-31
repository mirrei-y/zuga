import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { WorldPos } from "~/utilities/pos";
import { isColliding } from "./meta/collision";
import { batch } from "solid-js";

export const select = (pos: WorldPos, keep: boolean) => {
  const [hand, setHand] = handStore;
  const [contents] = contentsStore;
  if (hand.mode !== "select") return;

  batch(() => {
    if (!keep) {
      setHand({ selecteds: new Set() });
    }
    const clicked = Object.values(contents.contents).find((content) =>
      isColliding(content, pos)
    );
    if (clicked) {
      setHand({
        selecteds: new Set(hand.selecteds).add(clicked.uuid),
      });
    }
  });
};
