import { createStore } from "solid-js/store";
import { Pos } from "../utilities/pos";
import { checkNumberConstraint } from "~/utilities/numberConstraint";
import { useWindowSize } from "~/composables/useWindowSize";

export const cameraStore = createStore({
  center: { x: 0, y: 0 } as Pos,
  scale: 1,
});

export const zoom = (factor: number, centerPoint: Pos) => {
  const [camera, setCamera] = cameraStore;
  const windowSize = useWindowSize();

  const newScale = camera.scale * factor;
  if (!checkNumberConstraint({ min: 0.2, max: 5 }, newScale)) {
    return;
  }

  const worldPosBeforeZoom = screenToWorld(centerPoint, camera, windowSize());

  setCamera({ scale: newScale });

  const worldPosAfterZoom = screenToWorld(centerPoint, camera, windowSize());

  const dx = worldPosBeforeZoom.x - worldPosAfterZoom.x;
  const dy = worldPosBeforeZoom.y - worldPosAfterZoom.y;

  setCamera(c => ({
    center: {
      x: c.center.x + dx,
      y: c.center.y + dy,
    }
  }));
};

export const screenToWorld = (pos: Pos, camera: { scale: number, center: Pos }, windowSize: { width: number, height: number }) => {
  const worldX = pos.x / camera.scale + (camera.center.x - windowSize.width / 2 / camera.scale);
  const worldY = pos.y / camera.scale + (camera.center.y - windowSize.height / 2 / camera.scale);
  return { x: worldX, y: worldY };
}

export const worldToScreen = (pos: Pos, camera: { scale: number, center: Pos }, windowSize: { width: number, height: number }) => {
  const screenX = (pos.x - (camera.center.x - windowSize.width / 2 / camera.scale)) * camera.scale;
  const screenY = (pos.y - (camera.center.y - windowSize.height / 2 / camera.scale)) * camera.scale;
  return { x: screenX, y: screenY };
}
