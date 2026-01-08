import { WorldPos } from "~/utilities/pos";

export const pointInPolygon = (point: WorldPos, vs: WorldPos[]) => {
  let x = point.x,
    y = point.y;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i].x,
      yi = vs[i].y;
    let xj = vs[j].x,
      yj = vs[j].y;
    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};
