import { gridStore } from "~/stores/gridStore";
import { useCursorPos } from "./useCursorPos";
import { asWorldPos } from "~/utilities/pos";
import { createMemo } from "solid-js";
import { worldToScreen } from "~/utilities/coordinate";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const windowSize = useWindowSize();
  const [camera] = cameraStore;
  const [grid] = gridStore;

  const world = createMemo(() => {
    return asWorldPos({
      x: Math.round(cursorPos.world().x / grid.width) * grid.width,
      y: Math.round(cursorPos.world().y / grid.height) * grid.height,
    });
  });

  const screen = createMemo(() => {
    return worldToScreen(world(), camera, windowSize());
  });

  return { world, screen };
};
