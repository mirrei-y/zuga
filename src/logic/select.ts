import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { batch } from "solid-js";
import { isCollidingRectAndRect } from "~/utilities/rectCollision";

export const deselectAll = () => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;
  setHand({ selecteds: new Set() });
};

export const deleteSelection = () => {
  const [hand, setHand] = handStore;
  const [contents, setContents] = contentsStore;
  if (hand.mode !== "select") return;

  batch(() => {
    const newContents = { ...contents.contents };
    hand.selecteds.forEach((uuid) => {
      delete newContents[uuid];
    });
    setContents({ contents: newContents });
    setHand({ selecteds: new Set() });
  });
};

export const selectByRect = (rectSelection: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const [hand, setHand] = handStore;
  const [contents] = contentsStore;
  if (hand.mode !== "select") return;

  const selecteds =
    new Set<`${string}-${string}-${string}-${string}-${string}`>();
  for (const [id, rect] of Object.entries(contents.rects)) {
    if (isCollidingRectAndRect(rectSelection, rect)) {
      selecteds.add(id as `${string}-${string}-${string}-${string}-${string}`);
    }
  }
  setHand({ selecteds });
};

export const toggleSelection = (uuid: string) => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;

  const newSelecteds = new Set(hand.selecteds);
  if (hand.selecteds.has(uuid as any)) {
    newSelecteds.delete(uuid as any);
  } else {
    newSelecteds.add(uuid as any);
  }
  setHand({ selecteds: newSelecteds });
};

export const selectSingle = (uuid: `${string}-${string}-${string}-${string}-${string}`) => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;

  setHand({ selecteds: new Set([uuid]) });
};
