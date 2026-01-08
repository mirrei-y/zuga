import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { getLabelPos, propsExcluded } from "./utils";

export const Circuit = (
  props: {
    points: WorldPos[];
    props: Props<"circuit">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.circuit(props.points);
  const labelPos = () => {
    if (shape().points.length < 2)
      return {
        x: 0,
        y: 0,
        anchor: "middle" as const,
        baseline: "middle" as const,
      };
    const p0 = shape().points[0];
    const p1 = shape().points[1];
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    // 簡易的なバウンディングボックス中心
    return getLabelPos(
      { position: asWorldPos({ x: cx, y: cy }), size: { x: 0, y: 0 } },
      props.props
    );
  };

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const deg = (angle * 180) / Math.PI;

    const type = props.props.type;
    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;

    const ComponentGroup = (children: JSX.Element) => (
      <g
        transform={`translate(${p0.x}, ${p0.y}) rotate(${deg})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {children}
      </g>
    );

    switch (type) {
      case "resistor":
        // ジグザグ
        // 中央の30pxくらいをジグザグにする
        const width = 40;
        if (dist < width) {
          // 短すぎる場合は線だけ
          return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
        }
        const margin = (dist - width) / 2;
        return ComponentGroup(
          <>
            <line x1="0" y1="0" x2={margin} y2="0" />
            <polyline
              points={`${margin},0 ${margin + 2.5},-10 ${margin + 7.5},10 ${
                margin + 12.5
              },-10 ${margin + 17.5},10 ${margin + 22.5},-10 ${
                margin + 27.5
              },10 ${margin + 32.5},-10 ${margin + 37.5},10 ${
                margin + 40
              },0`}
            />
            <line x1={margin + width} y1="0" x2={dist} y2="0" />
          </>
        );
      case "capacitor":
        // 平行板
        const cWidth = 10;
        if (dist < cWidth * 2) {
          return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
        }
        const cMargin = (dist - cWidth) / 2;
        return ComponentGroup(
          <>
            <line x1="0" y1="0" x2={cMargin} y2="0" />
            <line x1={cMargin} y1="-15" x2={cMargin} y2="15" />
            <line
              x1={cMargin + cWidth}
              y1="-15"
              x2={cMargin + cWidth}
              y2="15"
            />
            <line x1={cMargin + cWidth} y1="0" x2={dist} y2="0" />
          </>
        );
      case "inductor":
        // コイル
        const lWidth = 40;
        if (dist < lWidth) {
          return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
        }
        const lMargin = (dist - lWidth) / 2;
        // 半円の連続でコイルを表現
        return ComponentGroup(
          <>
            <line x1="0" y1="0" x2={lMargin} y2="0" />
            <path
              d={`M ${lMargin} 0
                 Q ${lMargin + 5} -15 ${lMargin + 10} 0
                 Q ${lMargin + 15} -15 ${lMargin + 20} 0
                 Q ${lMargin + 25} -15 ${lMargin + 30} 0
                 Q ${lMargin + 35} -15 ${lMargin + 40} 0`}
              fill="none"
            />
            <line x1={lMargin + lWidth} y1="0" x2={dist} y2="0" />
          </>
        );
      case "source":
        // 直流電源
        const sWidth = 10;
        if (dist < sWidth * 2) {
          return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
        }
        const sMargin = (dist - sWidth) / 2;
        return ComponentGroup(
          <>
            <line x1="0" y1="0" x2={sMargin} y2="0" />
            <line x1={sMargin} y1="-15" x2={sMargin} y2="15" />
            <line
              x1={sMargin + sWidth}
              y1="-7.5"
              x2={sMargin + sWidth}
              y2="7.5"
            />
            <line x1={sMargin + sWidth} y1="0" x2={dist} y2="0" />
            {/* プラス記号 */}
            <line
              x1={sMargin - 5}
              y1="-10"
              x2={sMargin - 5}
              y2="-20"
              stroke-width="1"
            />
            <line
              x1={sMargin - 10}
              y1="-15"
              x2={sMargin}
              y2="-15"
              stroke-width="1"
            />
          </>
        );
      case "gnd":
        // GND
        return ComponentGroup(
          <>
            <line x1="0" y1="0" x2={dist} y2="0" />
            <line x1={dist} y1="-15" x2={dist} y2="15" />
            <line x1={dist + 5} y1="-10" x2={dist + 5} y2="10" />
            <line x1={dist + 10} y1="-5" x2={dist + 10} y2="5" />
          </>
        );
      default:
        return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
    }
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
      <Show when={props.props.label}>
        <text
          x={labelPos().x}
          y={labelPos().y}
          fill={props.props.labelColor ?? "black"}
          font-size={(props.props.labelSize ?? 16) + "px"}
          text-anchor={labelPos().anchor}
          dominant-baseline={labelPos().baseline}
        >
          {props.props.label}
        </text>
      </Show>
    </g>
  );
};
