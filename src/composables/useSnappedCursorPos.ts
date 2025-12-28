import { gridStore } from "~/stores/gridStore";
import { useCursorPos } from "./useCursorPos";
import { Pos } from "~/utilities/pos";
import { cameraStore, screenToWorld } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const [camera, _setCamera] = cameraStore;
  const windowSize = useWindowSize();
  const [grid, _setGrid] = gridStore;

  const snappedCursorPos = () => {
    const worldPos = screenToWorld(cursorPos(), camera, windowSize());

    return {
      x: Math.round(worldPos.x / grid.width) * grid.width,
      y: Math.round(worldPos.y / grid.height) * grid.height,
    } as Pos
  };

  return snappedCursorPos;
};
