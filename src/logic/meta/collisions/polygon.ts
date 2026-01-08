import { WorldPos } from "~/utilities/pos";
import { Content } from "../../content";
import { prerenders } from "../prerenders";
import { pointInPolygon } from "./utils";

export const isCollidingPolygon = (
  content: Content<"polygon">,
  pos: WorldPos
): boolean => {
  const shape = prerenders.polygon(content.points);
  const points = shape.points;
  const threshold = content.props.strokeWidth / 2 + 10;
  let onEdge = false;

  // Close the loop for polygon
  const pointsClosed = [...points, points[0]];

  for (let i = 0; i < pointsClosed.length - 1; i++) {
    const p1 = pointsClosed[i];
    const p2 = pointsClosed[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dpx = pos.x - p1.x;
    const dpy = pos.y - p1.y;

    const lenSq = dx * dx + dy * dy;

    let distanceSq: number;

    if (lenSq === 0) {
      distanceSq = dpx * dpx + dpy * dpy;
    } else {
      let t = (dpx * dx + dpy * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));

      const nearestX = p1.x + t * dx;
      const nearestY = p1.y + t * dy;

      const distX = pos.x - nearestX;
      const distY = pos.y - nearestY;
      distanceSq = distX * distX + distY * distY;
    }

    if (distanceSq <= threshold * threshold) {
      onEdge = true;
      break;
    }
  }

  return (
    onEdge ||
    (content.props.color !== "transparent" && pointInPolygon(pos, points))
  );
};
