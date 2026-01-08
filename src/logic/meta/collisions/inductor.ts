import { WorldPos } from "~/utilities/pos";
import { Content } from "../../content";
import { prerenders } from "../prerenders";

export const isCollidingInductor = (
  content: Content<"inductor">,
  pos: WorldPos
): boolean => {
  const shape = prerenders.inductor(content.points);
  const points = shape.points;
  if (points.length < 2) return false;
  const p1 = points[0];
  const p2 = points[1];

  const threshold = content.props.strokeWidth / 2 + 10;

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
    return true;
  }
  return false;
};
