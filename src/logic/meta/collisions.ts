import { WorldPos } from "../../utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";
import { isCollidingRectangle } from "./collisions/rectangle";
import { isCollidingEllipse } from "./collisions/ellipse";
import { isCollidingPolygon } from "./collisions/polygon";
import { isCollidingLine } from "./collisions/line";
import { isCollidingCapacitor } from "./collisions/capacitor";
import { isCollidingInductor } from "./collisions/inductor";
import { isCollidingResistor } from "./collisions/resistor";
import { isCollidingGnd } from "./collisions/gnd";
import { isCollidingSource } from "./collisions/source";

export const isColliding = (content: Content<Kind>, pos: WorldPos): boolean => {
  switch (content.kind) {
    case "rectangle":
      return isCollidingRectangle(content, pos);
    case "ellipse":
      return isCollidingEllipse(content, pos);
    case "polygon":
      return isCollidingPolygon(content, pos);
    case "line":
      return isCollidingLine(content, pos);
    case "capacitor":
      return isCollidingCapacitor(content, pos);
    case "inductor": {
      return isCollidingInductor(content, pos);
    }
    case "resistor": {
      return isCollidingResistor(content, pos);
    }
    case "gnd": {
      return isCollidingGnd(content, pos);
    }
    case "source": {
      return isCollidingSource(content, pos);
    }
    case "text": {
      return true;
    }
    case "math": {
      return true;
    }
    default:
      content satisfies never;
      return false;
  }
};
