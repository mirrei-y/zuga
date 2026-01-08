import { WorldPos } from "~/utilities/pos";
import { Content } from "../../content";
import { prerenders } from "../prerenders";

export const isCollidingEllipse = (
  content: Content<"ellipse">,
  pos: WorldPos
): boolean => {
  const shape = prerenders.ellipse(content.points);

  const dx = pos.x - shape.center.x;
  const dy = pos.y - shape.center.y;
  const rx = shape.radius.x;
  const ry = shape.radius.y;
  const distance = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

  const strokeAdjustmentX = (content.props.strokeWidth / 2 + 10) / rx;
  const strokeAdjustmentY = (content.props.strokeWidth / 2 + 10) / ry;

  return (
    (distance >= 1 - strokeAdjustmentX - strokeAdjustmentY &&
      distance <= 1 + strokeAdjustmentX + strokeAdjustmentY) ||
    (content.props.color !== "transparent" && distance < 1)
  );
};
