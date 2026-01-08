import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Text = (
  props: {
    points: WorldPos[];
    props: Props<"text">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.text(props.points);
  return (
    <text
      x={shape().position.x}
      y={shape().position.y}
      font-size={props.props.fontSize + "px"}
      fill={props.props.color}
      text-anchor="middle"
      dominant-baseline="middle"
      {...propsExcluded(props)}
    >
      {props.props.content}
    </text>
  );
};
