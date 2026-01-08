import { JSX } from "solid-js";
import { render } from "solid-js/web";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import katex from "katex";
import { Rect } from "~/utilities/rect";
import { propsExcluded } from "./utils";

export const MathShape = (
  props: {
    points: WorldPos[];
    props: Props<"math">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.math(props.points);
  const rendered = () => (
    <div
      // @ts-ignore
      xmlns="http://www.w3.org/1999/xhtml"
      innerHTML={katex.renderToString(props.props.content, {
        throwOnError: false,
        output: "html",
        displayMode: true,
      })}
      style={{ color: "black" }}
    ></div>
  );
  const getRect = (component: JSX.Element): Rect => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
    wrapper.style.position = "absolute";
    wrapper.style.visibility = "hidden";
    wrapper.style.pointerEvents = "none";
    render(() => component, wrapper);
    const rect = wrapper.getBoundingClientRect();
    document.body.removeChild(wrapper);
    return {
      position: { x: rect.x, y: rect.y },
      size: { x: rect.width, y: rect.height },
    };
  };
  const rect = () => getRect(rendered());

  return (
    <g {...propsExcluded(props)}>
      <foreignObject
        x={shape().position.x - rect().size.x / 2}
        y={shape().position.y - rect().size.y / 2}
        width={rect().size.x}
        height={rect().size.y}
      >
        {rendered()}
      </foreignObject>
    </g>
  );
};
