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
    anchors: WorldPos[];
  };
  type HorizontalLine = {
    type: "horizontal";
    y: number;
    anchors: WorldPos[];
  };
  type Line = VerticalLine | HorizontalLine;

  const lines = createMemo(() => {
    const anchorBased = everyAnchors().flatMap(
      (anchor) =>
        [
          { type: "vertical", x: anchor.x, anchors: [anchor] },
          { type: "horizontal", y: anchor.y, anchors: [anchor] },
        ] as Line[]
    );

    const sameXMap = new Map<number, WorldPos[]>();
    const sameYMap = new Map<number, WorldPos[]>();
    for (const anchor of everyAnchors()) {
      if (!sameXMap.has(anchor.x)) {
        sameXMap.set(anchor.x, []);
      }
      sameXMap.get(anchor.x)!.push(anchor);

      if (!sameYMap.has(anchor.y)) {
        sameYMap.set(anchor.y, []);
      }
      sameYMap.get(anchor.y)!.push(anchor);
    }

    const anchorHalfBased: Line[] = [];

    for (const anchors of sameXMap.values()) {
      if (anchors.length >= 2) {
        anchors.sort((a, b) => a.y - b.y);
        for (let i = 0; i < anchors.length - 1; i++) {
          const yMid = (anchors[i].y + anchors[i + 1].y) / 2;
          anchorHalfBased.push({
            type: "horizontal",
            y: yMid,
            anchors: [anchors[i], anchors[i + 1]],
          });
        }
      }
    }

    for (const anchors of sameYMap.values()) {
      if (anchors.length >= 2) {
        anchors.sort((a, b) => a.x - b.x);
        for (let i = 0; i < anchors.length - 1; i++) {
          const xMid = (anchors[i].x + anchors[i + 1].x) / 2;
          anchorHalfBased.push({
            type: "vertical",
            x: xMid,
            anchors: [anchors[i], anchors[i + 1]],
          });
        }
      }
    }

    return [...anchorBased, ...anchorHalfBased];
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
      if (Math.abs(original.x - gridSnapped) < 5 / camera.scale) {
        snappedX = gridSnapped;
      }
    }
    if (lineY) {
      snappedY = lineY.y;
    } else {
      const gridSnapped = Math.round(original.y / 30) * 30;
      if (Math.abs(original.y - gridSnapped) < 5 / camera.scale) {
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
