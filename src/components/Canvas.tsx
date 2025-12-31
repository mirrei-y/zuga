import { createMemo, createSignal, For, Show } from "solid-js";
import { useDrag } from "~/composables/useDrag";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import { addPoint, cancelDrawing, finishIfPossible } from "~/logic/draw";
import { select } from "~/logic/select";
import { cameraStore } from "~/stores/cameraStore";
import { clickStore } from "~/stores/clickStore";
import { contentsStore } from "~/stores/contentsStore";
import { gridStore } from "~/stores/gridStore";
import { handStore } from "~/stores/handStore";
import { isSatisfied } from "~/utilities/constraint";
import { worldToScreen } from "~/utilities/coordinate";
import { asWorldPos } from "~/utilities/pos";
import { Svg } from "~/logic/meta/svgs";
import { requiredPoints } from "~/logic/meta/requiredPoints";
import { shapeProp } from "~/logic/meta/shapeProps";
import { defaultOtherProp } from "~/logic/meta/otherProps";
import { Content } from "~/logic/content";
import { useSampled } from "~/composables/useDebounced";
import { isColliding } from "~/logic/meta/collision";
import Item from "./Item";

export default function Canvas() {
  const [grid] = gridStore;
  const [hand] = handStore;
  const [content] = contentsStore;
  const [camera, setCamera] = cameraStore;
  const [, setClick] = clickStore;
  const windowSize = useWindowSize();
  const snappedCursorPos = useSnappedCursorPos();
  const cursorPos = useSnappedCursorPos();
  const sampledWorldCursorPos = useSampled(cursorPos.world, 100);

  const hovereds = createMemo(() => {
    return Object.values(content.contents).filter((c) => {
      isColliding(c, sampledWorldCursorPos());
    });
  });

  const gridSize = createMemo(() => ({
    width: grid.width * camera.scale,
    height: grid.height * camera.scale,
  }));
  const gridPosition = createMemo(() => {
    const worldOriginScreen = worldToScreen(
      asWorldPos({ x: 0, y: 0 }),
      camera,
      windowSize()
    );
    return {
      x:
        ((worldOriginScreen.x % gridSize().width) + gridSize().width) %
        gridSize().width,
      y:
        ((worldOriginScreen.y % gridSize().height) + gridSize().height) %
        gridSize().height,
    };
  });

  const { startDrag: pan } = useDrag({
    onStart: () => {
      return { x: camera.center.x, y: camera.center.y };
    },
    onMove: (start, current, initialCamera) => {
      const dx = (start.x - current.x) / camera.scale;
      const dy = (start.y - current.y) / camera.scale;
      setCamera({
        center: asWorldPos({
          x: initialCamera.x + dx,
          y: initialCamera.y + dy,
        }),
      });
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode === "select") {
      switch (e.button) {
        case 0:
          select(snappedCursorPos.world(), e.shiftKey);
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

  return (
    <main
      class="w-full h-screen text-gray-100 bg-grid"
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
          camera.center.x - windowSize().width / 2 / camera.scale,
          camera.center.y - windowSize().height / 2 / camera.scale,
          windowSize().width / camera.scale,
          windowSize().height / camera.scale,
        ].join(" ")}
        onMouseDown={handleMousedown}
        onMouseUp={handleMouseup}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <For each={Object.values(content.contents)}>
          {(content) => <Item content={content} />}
        </For>

        <Show
          when={
            hand.mode === "draw" &&
            isSatisfied(requiredPoints[hand.kind], hand.points.length + 1) &&
            hand
          }
        >
          {(hand) => (
            <Svg
              content={
                {
                  uuid: "preview-preview-preview-preview-preview",
                  kind: hand().kind,
                  shapeProps: shapeProp(hand().kind, [
                    ...hand().points,
                    snappedCursorPos.world(),
                  ]),
                  otherProps: defaultOtherProp(hand().kind),
                } as Content
              }
              class="opacity-50"
            />
          )}
        </Show>
      </svg>
    </main>
  );
}
