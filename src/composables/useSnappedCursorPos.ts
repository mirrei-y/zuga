import { useCursorPos } from "./useCursorPos";
import { createMemo } from "solid-js";
import { worldToScreen } from "~/utilities/coordinate";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const windowSize = useWindowSize();
  const [camera] = cameraStore;

  const world = createMemo(() => {
    // snapping logic here...
    return cursorPos.world();
  });

  const screen = createMemo(() => {
    return worldToScreen(world(), camera, windowSize());
  });

  return { world, screen };
};
