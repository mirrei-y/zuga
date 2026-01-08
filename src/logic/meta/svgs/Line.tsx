import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Line = (
  props: {
    points: WorldPos[];
    props: Props<"line">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.line(props.points);
  const arrowHead = (
    pos: WorldPos,
    angle: number,
    color: string,
    strokeWidth: number
  ) => {
    const size = strokeWidth * 3 + 4; // 矢印のサイズ
    const x1 = pos.x - size * Math.cos(angle - Math.PI / 6);
    const y1 = pos.y - size * Math.sin(angle - Math.PI / 6);
    const x2 = pos.x - size * Math.cos(angle + Math.PI / 6);
    const y2 = pos.y - size * Math.sin(angle + Math.PI / 6);
    return (
      <polygon
        points={`${pos.x},${pos.y} ${x1},${y1} ${x2},${y2}`}
        fill={color}
        stroke="none"
      />
    );
  };

  return (
    <g {...propsExcluded(props)}>
      <polyline
        points={shape()
          .points.map((pt) => `${pt.x},${pt.y}`)
          .join(" ")}
        fill="none"
        stroke={props.props.color}
        stroke-width={props.props.strokeWidth}
      />
      <Show when={props.props.arrowStart && shape().points.length >= 2}>
        {(() => {
          const p0 = shape().points[0];
          const p1 = shape().points[1];
          // 始点は p1 -> p0 の方向を向く
          return arrowHead(
            p0,
            Math.atan2(p0.y - p1.y, p0.x - p1.x),
            props.props.color,
            props.props.strokeWidth
          );
        })()}
      </Show>
      <Show when={props.props.arrowEnd && shape().points.length >= 2}>
        {(() => {
          const points = shape().points;
          const pn = points[points.length - 1];
          const pn_1 = points[points.length - 2];
          // 終点は pn_1 -> pn の方向を向く
          return arrowHead(
            pn,
            Math.atan2(pn.y - pn_1.y, pn.x - pn_1.x),
            props.props.color,
            props.props.strokeWidth
          );
        })()}
      </Show>
    </g>
  );
};
