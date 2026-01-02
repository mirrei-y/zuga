import { useCursorPos } from "./useCursorPos";
import { createMemo } from "solid-js";
import { worldToScreen } from "~/utilities/coordinate";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";
import { contentsStore } from "~/stores/contentsStore";
import { anchors } from "~/logic/meta/anchors";
import { asWorldPos, WorldPos } from "~/utilities/pos";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const windowSize = useWindowSize();
  const [camera] = cameraStore;
  const [contents] = contentsStore;

  const everyAnchors = createMemo(() => {
    return Object.values(contents.contents).flatMap((content) =>
      anchors(content)
    );
  });

  type VerticalLine = {
    type: "vertical";
    x: number;
    anchor: WorldPos;
  };
  type HorizontalLine = {
    type: "horizontal";
    y: number;
    anchor: WorldPos;
  };
  type Line = VerticalLine | HorizontalLine;

  const lines = createMemo(() => {
    const anchorBased = everyAnchors().flatMap(
      (anchor) =>
        [
          { type: "vertical", x: anchor.x, anchor },
          { type: "horizontal", y: anchor.y, anchor },
        ] as Line[]
    );

    const distanceBased = everyAnchors().flatMap(
      (anchor) =>
        [
          { type: "vertical", x: anchor.x + 30, anchor },
          { type: "vertical", x: anchor.x - 30, anchor },
          { type: "horizontal", y: anchor.y + 30, anchor },
          { type: "horizontal", y: anchor.y - 30, anchor },
        ] as Line[]
    );

    return [...new Set([...anchorBased, ...distanceBased])];
  });

  const targetLine = createMemo<{
    x: VerticalLine | null;
    y: HorizontalLine | null;
  }>(() => {
    const worldPos = cursorPos.world();
    const snapThreshold = 10 / camera.scale;

    let closestX: Line | null = null;
    let closestY: Line | null = null;
    let closestXDist = Infinity;
    let closestYDist = Infinity;

    for (const line of lines()) {
      if (line.type === "vertical") {
        const dist = Math.abs(worldPos.x - line.x);
        if (dist <= snapThreshold && dist < closestXDist) {
          closestX = line;
          closestXDist = dist;
        }
      } else if (line.type === "horizontal") {
        const dist = Math.abs(worldPos.y - line.y);
        if (dist <= snapThreshold && dist < closestYDist) {
          closestY = line;
          closestYDist = dist;
        }
      }
    }

    const threshold = 10 / camera.scale;

    return {
      x: closestXDist < threshold ? closestX : null,
      y: closestYDist < threshold ? closestY : null,
    };
  });

  const world = createMemo(() => {
    const original = cursorPos.world();
    const lineX = targetLine().x;
    const lineY = targetLine().y;

    let snappedX = original.x;
    let snappedY = original.y;

    if (lineX) {
      snappedX = lineX.x;
    } else {
      const gridSnapped = Math.round(original.x / 30) * 30;
      if (Math.abs(original.x - gridSnapped) < 10 / camera.scale) {
        snappedX = gridSnapped;
      }
    }
    if (lineY) {
      snappedY = lineY.y;
    } else {
      const gridSnapped = Math.round(original.y / 30) * 30;
      if (Math.abs(original.y - gridSnapped) < 10 / camera.scale) {
        snappedY = gridSnapped;
      }
    }

    return asWorldPos({ x: snappedX, y: snappedY });
  });

  const screen = createMemo(() => {
    return worldToScreen(world(), camera, windowSize());
  });

  return { world, screen, targetLine };
};
