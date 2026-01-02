import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { Content } from "~/logic/content";
import { isSatisfied } from "~/utilities/constraint";
import { WorldPos } from "~/utilities/pos";
import { requiredPoints } from "./meta/requiredPoints";
import { defaultProps } from "./meta/props";

const finish = () => {
  const [hand, setHand] = handStore;
  const [content, setContent] = contentsStore;
  if (hand.mode !== "draw") return;

  const newUuid = crypto.randomUUID();
  setContent({
    contents: {
      ...content.contents,
      [newUuid]: {
        uuid: newUuid,
        kind: hand.kind,
        points: hand.points,
        props: defaultProps[hand.kind],
      } as Content<typeof hand.kind>,
    },
  });
  setHand({ points: [] });
};

export const finishIfPossible = (lastPos?: WorldPos) => {
  const [hand, setHand] = handStore;

  if (hand.mode !== "draw") return;
  if (lastPos) {
    if (
      isSatisfied(requiredPoints[hand.kind], hand.points.length + 1) &&
      hand.points.at(-1) &&
      hand.points.at(-1)!.x !== lastPos.x &&
      hand.points.at(-1)!.y !== lastPos.y
    ) {
      setHand({
        points: [...hand.points, lastPos],
      });
      finish();
    }
  } else {
    if (isSatisfied(requiredPoints[hand.kind], hand.points.length)) {
      finish();
    }
  }
};

export const finishIfRequired = () => {
  const [hand] = handStore;

  if (hand.mode !== "draw") return;
  if (
    isSatisfied(requiredPoints[hand.kind], hand.points.length) &&
    !isSatisfied(requiredPoints[hand.kind], hand.points.length + 1)
  ) {
    finish();
  }
};

export const addPoint = (pos: WorldPos) => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "draw") return;

  setHand({
    points: [...hand.points, pos],
  });
};

export const cancelDrawing = () => {
  const [hand, setHand] = handStore;

  if (hand.mode !== "draw") return;
  setHand({ points: [] });
};
