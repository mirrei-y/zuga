import { asWorldPos, WorldPos } from "~/utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";

export const anchors = (content: Content<Kind>): WorldPos[] => {
  switch (content.kind) {
    case "rectangle": {
      const [pt1, pt2] = content.points;
      return [
        asWorldPos({ x: pt1.x, y: pt1.y }),
        asWorldPos({ x: pt2.x, y: pt1.y }),
        asWorldPos({ x: pt2.x, y: pt2.y }),
        asWorldPos({ x: pt1.x, y: pt2.y }),
      ];
    }
    case "ellipse": {
      const [pt1, pt2] = content.points;
      return [
        asWorldPos({ x: (pt1.x + pt2.x) / 2, y: pt1.y }),
        asWorldPos({ x: pt2.x, y: (pt1.y + pt2.y) / 2 }),
        asWorldPos({ x: (pt1.x + pt2.x) / 2, y: pt2.y }),
        asWorldPos({ x: pt1.x, y: (pt1.y + pt2.y) / 2 }),
      ];
    }
    case "line": {
      return content.points;
    }
    case "text": {
      return content.points;
    }
    case "math": {
      return content.points;
    }
    default: {
      content satisfies never;
      throw new Error(`Unknown content kind: ${(content as any).kind}`);
    }
  }
};
