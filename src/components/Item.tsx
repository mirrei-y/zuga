import { Content } from "~/logic/content";
import { Svg } from "~/logic/meta/svgs";
import { createMemo, createSignal, Index, onMount, Show } from "solid-js";
import { handStore } from "~/stores/handStore";
import { useCursorPos } from "~/composables/useCursorPos";
import { useSampled } from "~/composables/useDebounced";
import { isColliding } from "~/logic/meta/collisions";
import { Kind } from "~/logic/kind";
import { useDrag } from "~/composables/useDrag";
import { contentsStore } from "~/stores/contentsStore";
import { cameraStore } from "~/stores/cameraStore";
import { Portal } from "solid-js/web";
import { isCollidingRectAndPoint } from "~/utilities/rectCollision";
import { selectSingle, toggleSelection } from "~/logic/select";
import { updateContentPoints, updatePointPosition } from "~/logic/transform";
import { WorldPos } from "~/utilities/pos";

export default function Item<K extends Kind>(props: { content: Content<K> }) {
  let ref: SVGGraphicsElement | undefined;
  const [rect, setRect] = createSignal<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();
  const [hand] = handStore;
  const [contents, setContents] = contentsStore;
  const [camera] = cameraStore;

  const cursorPos = useCursorPos();
  const sampledWorldCursorPos = useSampled(cursorPos.world, 100);
  const isHovering = createMemo(() => {
    if (!rect()) return false;
    if (isCollidingRectAndPoint(rect()!, sampledWorldCursorPos())) {
      return isColliding(props.content, sampledWorldCursorPos());
    }
    return false;
  });

  onMount(() => {
    if (ref) {
      const bbox = ref.getBBox();
      const strokeWidth = parseFloat(getComputedStyle(ref).strokeWidth) || 0;
      const expandedBBox = {
        x: bbox.x - strokeWidth / 2,
        y: bbox.y - strokeWidth / 2,
        width: bbox.width + strokeWidth,
        height: bbox.height + strokeWidth,
      };

      setRect(expandedBBox);
      setContents({
        rects: {
          ...contents.rects,
          [props.content.uuid]: expandedBBox,
        },
      });
    }
  });

  const [originalPoints, setOriginalPoints] = createSignal<WorldPos[]>([]);
  const startBodyDrag = useDrag({
    onStart: () => {
      setOriginalPoints([...props.content.points]);
    },
    onMove: (delta) => {
      updateContentPoints(
        props.content.uuid,
        originalPoints(),
        delta,
        camera.scale
      );
    },
  });

  const handleBodyMousedown = (e: MouseEvent) => {
    if (hand.mode !== "select") return;
    console.log("down on body");
    if (isHovering()) {
      e.stopPropagation();
      if (e.shiftKey) {
        toggleSelection(props.content.uuid);
      } else {
        selectSingle(props.content.uuid);
        startBodyDrag(cursorPos.screen());
      }
    }
  };

  const [draggingPointIndex, setDraggingPointIndex] = createSignal<
    number | null
  >(null);
  const [originalPoint, setOriginalPoint] = createSignal<WorldPos | null>(null);

  const startPointDrag = useDrag({
    onStart: () => {
      const index = draggingPointIndex();
      if (index !== null && props.content.points[index]) {
        setOriginalPoint({ ...props.content.points[index] });
      }
    },
    onMove: (delta) => {
      const index = draggingPointIndex();
      const origin = originalPoint();
      if (index !== null && origin) {
        updatePointPosition(
          props.content.uuid,
          index,
          origin,
          delta,
          camera.scale
        );
      }
    },
  });

  const handlePointMousedown = (e: MouseEvent) => {
    if (hand.mode !== "select") return;
    e.stopPropagation();
    console.log("down on point");
    setDraggingPointIndex(
      Number((e.currentTarget! as HTMLElement).getAttribute("data-index"))
    );
    startPointDrag(cursorPos.screen());
  };

  return (
    <>
      <Svg content={props.content} ref={ref} />
      <Show
        when={
          hand.mode === "select" &&
          (hand.selecteds.has(props.content.uuid) || isHovering()) &&
          hand
        }
      >
        {(hand) => (
          <Portal mount={document.getElementById("rect-portal")!} isSVG>
            <rect
              x={(rect()?.x ?? 0) - 10}
              y={(rect()?.y ?? 0) - 10}
              width={(rect()?.width ?? 0) + 20}
              height={(rect()?.height ?? 0) + 20}
              fill="transparent"
              stroke={
                hand().selecteds.has(props.content.uuid)
                  ? "var(--color-cyan-500)"
                  : "var(--color-cyan-700)"
              }
              stroke-width={2 / camera.scale}
              onMouseDown={handleBodyMousedown}
            />
          </Portal>
        )}
      </Show>

      <Show
        when={
          hand.mode === "select" &&
          hand.selecteds.has(props.content.uuid) &&
          hand
        }
      >
        <Portal mount={document.getElementById("point-portal")!} isSVG>
          <Index each={contents.contents[props.content.uuid].points}>
            {(pt, index) => (
              <circle
                cx={pt().x}
                cy={pt().y}
                r={6 / camera.scale}
                fill="var(--color-white)"
                stroke="var(--color-cyan-500)"
                stroke-width={2 / camera.scale}
                onMouseDown={handlePointMousedown}
                data-index={index}
              />
            )}
          </Index>
        </Portal>
      </Show>
    </>
  );
}
