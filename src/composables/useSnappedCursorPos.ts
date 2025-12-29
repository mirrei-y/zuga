import { gridStore } from "~/stores/gridStore";
import { useCursorPos } from "./useCursorPos";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";
import { screenToWorld } from "~/utilities/coordinate";
import { toWorldPos } from "~/utilities/pos";
import { createMemo } from "solid-js";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const [camera] = cameraStore;
  const windowSize = useWindowSize();
  const [grid] = gridStore;

  const snappedCursorPos = createMemo(() => {
    const worldPos = screenToWorld(cursorPos(), camera, windowSize());

    return toWorldPos({
      x: Math.round(worldPos.x / grid.width) * grid.width,
      y: Math.round(worldPos.y / grid.height) * grid.height,
    });
  });

  return snappedCursorPos;
};
