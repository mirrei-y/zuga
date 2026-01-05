import { JSX, splitProps } from "solid-js";
import { Kind } from "../kind";
import { Dynamic, render } from "solid-js/web";
import { Props } from "./props";
import { Content } from "../content";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "./prerenders";
import katex from "katex";
import { Rect } from "~/utilities/rect";

const propsExcluded = (
  props: {
    points: WorldPos[];
    props: Props<Kind>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["points", "props"])[1];
};

export const svgs: {
  [K in Kind]: (
    props: {
      points: WorldPos[];
      props: Props<K>;
    } & JSX.ShapeElementSVGAttributes<any>
  ) => JSX.Element;
} = {
  rectangle: (props) => {
    const shape = () => prerenders.rectangle(props.points);
    return (
      <rect
        x={shape().position.x}
        y={shape().position.y}
        width={shape().size.x}
        height={shape().size.y}
        fill={props.props.color}
        stroke={props.props.strokeColor}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  ellipse: (props) => {
    const shape = () => prerenders.ellipse(props.points);
    return (
      <ellipse
        cx={shape().center.x}
        cy={shape().center.y}
        rx={shape().radius.x}
        ry={shape().radius.y}
        fill={props.props.color}
        stroke={props.props.strokeColor}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  line: (props) => {
    const shape = () => prerenders.line(props.points);
    return (
      <polyline
        points={shape()
          .points.map((pt) => `${pt.x},${pt.y}`)
          .join(" ")}
        fill="none"
        stroke={props.props.color}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  text: (props) => {
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
  },
  math: (props) => {
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
  },
};

const contentExcluded = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["content"])[1];
};

export const Svg = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
): JSX.Element => {
  return (
    <Dynamic
      component={svgs[props.content.kind] as () => JSX.Element}
      points={props.content.points}
      props={props.content.props}
      {...contentExcluded(props)}
    />
  );
};
