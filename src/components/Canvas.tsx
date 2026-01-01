import { createMemo, createSignal, For, Show } from "solid-js";
import { useDrag } from "~/composables/useDrag";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import { addPoint, cancelDrawing, finishIfPossible } from "~/logic/draw";
import { deleteSelection, deselectAll, selectByRect } from "~/logic/select";
import { cameraStore } from "~/stores/cameraStore";
import { clickStore } from "~/stores/clickStore";
import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { isSatisfied } from "~/utilities/constraint";
import { screenToWorld, worldToScreen } from "~/utilities/coordinate";
import { asScreenPos, asWorldPos } from "~/utilities/pos";
import { Svg } from "~/logic/meta/svgs";
import { requiredPoints } from "~/logic/meta/requiredPoints";
import { defaultProps } from "~/logic/meta/props";
import { Content } from "~/logic/content";
import Item from "./Item";
import { useHotkey } from "~/composables/useHotkey";
import { useCursorPos } from "~/composables/useCursorPos";

export default function Canvas() {
  const [hand, setHand] = handStore;
  const [contents] = contentsStore;
  const [camera, setCamera] = cameraStore;
  const [, setClick] = clickStore;
  const windowSize = useWindowSize();
  const snappedCursorPos = useSnappedCursorPos();
  const cursorPos = useCursorPos();

  const gridSize = createMemo(() => ({
    width: 30 * camera.scale,
    height: 30 * camera.scale,
  }));
  const gridPosition = createMemo(() =>
    worldToScreen(asWorldPos({ x: 0, y: 0 }), camera, windowSize())
  );

  const northWest = () =>
    screenToWorld(asScreenPos({ x: 0, y: 0 }), camera, windowSize());
  const southEast = () =>
    screenToWorld(
      asScreenPos({ x: windowSize().width, y: windowSize().height }),
      camera,
      windowSize()
    );

  const currentContent = () => {
    if (hand.mode !== "draw") return null;
    if (!isSatisfied(requiredPoints[hand.kind], hand.points.length + 1))
      return null;
    return {
      uuid: "preview-preview-preview-preview-preview",
      kind: hand.kind,
      points: [...hand.points, snappedCursorPos.world()],
      props: defaultProps[hand.kind],
    } as Content<typeof hand.kind>;
  };

  const [cameraBeforePan, setCameraBeforePan] = createSignal(camera);
  const pan = useDrag({
    onStart: () => {
      setCameraBeforePan({ ...camera });
    },
    onMove: (delta) => {
      setCamera({
        center: asWorldPos({
          x: cameraBeforePan().center.x - delta.x / camera.scale,
          y: cameraBeforePan().center.y - delta.y / camera.scale,
        }),
      });
    },
  });

  const startRectSelection = useDrag({
    onStart: () => {
      setHand({
        rect: {
          start: cursorPos.world(),
          end: cursorPos.world(),
        },
      });
    },
    onMove: () => {
      if (hand.mode !== "select") return;
      const rectSelection = {
        x: hand.rect!.start.x,
        y: hand.rect!.start.y,
        width: cursorPos.world().x - hand.rect!.start.x,
        height: cursorPos.world().y - hand.rect!.start.y,
      };

      selectByRect(rectSelection);

      setHand({
        rect: {
          start: hand.rect!.start,
          end: cursorPos.world(),
        },
      });
    },
    onEnd: () => {
      if (hand.mode !== "select") return;
      setHand({
        rect: null,
      });
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode === "select") {
      switch (e.button) {
        case 0:
          deselectAll();
          startRectSelection(cursorPos.screen());
          return;
        case 1:
          e.preventDefault();
          pan(cursorPos.screen());
          return;
      }
    } else if (hand.mode === "draw") {
      switch (e.button) {
        case 0:
          addPoint(snappedCursorPos.world());
          setClick({ lastClickedAt: performance.now() });
          return;
        case 1:
          e.preventDefault();
          pan(cursorPos.screen());
          return;
        case 2:
          cancelDrawing();
          return;
      }
    }
  };

  const handleMouseup = () => {
    if (hand.mode !== "draw") return;
    finishIfPossible(snappedCursorPos.world());
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const newScale = camera.scale * (1 - e.deltaY * 0.001);
    if (newScale < 0.1 || 10 < newScale) {
      return;
    }
    setCamera(() => {
      return {
        scale: newScale,
        center: asWorldPos({
          x:
            cursorPos.world().x -
            (cursorPos.screen().x - windowSize().width / 2) / newScale,
          y:
            cursorPos.world().y -
            (cursorPos.screen().y - windowSize().height / 2) / newScale,
        }),
      };
    });
  };

  useHotkey("Delete", () => {
    deleteSelection();
  });

  return (
    <main
      class="w-full h-screen text-slate-100 bg-grid slate"
      style={{
        "background-size": `${gridSize().width}px ${gridSize().height}px`,
        "background-position-x": `${gridPosition().x}px`,
        "background-position-y": `${gridPosition().y}px`,
      }}
    >
      <svg
        class="cursor-crosshair select-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={[
          northWest().x,
          northWest().y,
          southEast().x - northWest().x,
          southEast().y - northWest().y,
        ].join(" ")}
        onMouseDown={handleMousedown}
        onMouseUp={handleMouseup}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <For each={Object.values(contents.contents)}>
          {(content) => <Item content={content} />}
        </For>

        <Show when={currentContent()}>
          {(content) => <Svg content={content()} class="opacity-50" />}
        </Show>

        <Show when={hand.mode === "select" && hand.rect}>
          {(rect) => (
            <rect
              x={Math.min(rect().start.x, rect().end.x)}
              y={Math.min(rect().start.y, rect().end.y)}
              width={Math.abs(rect().end.x - rect().start.x)}
              height={Math.abs(rect().end.y - rect().start.y)}
              fill="rgba(100, 149, 237, 0.3)"
              stroke="cornflowerblue"
              stroke-dasharray="4 4"
            />
          )}
        </Show>

        <g id="rect-portal"></g>
        <g id="point-portal"></g>
      </svg>
    </main>
  );
}
