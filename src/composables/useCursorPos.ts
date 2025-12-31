import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { cameraStore } from "~/stores/cameraStore";
import { asScreenPos } from "~/utilities/pos";
import { useWindowSize } from "./useWindowSize";
import { screenToWorld } from "~/utilities/coordinate";

export const useCursorPos = () => {
  const [camera] = cameraStore;
  const windowSize = useWindowSize();
  const [pos, setPos] = createSignal(asScreenPos({ x: 0, y: 0 }));

  const updatePos = (x: number, y: number) => {
    setPos(asScreenPos({ x, y }));
  };

  const world = createMemo(() => {
    return screenToWorld(pos(), camera, windowSize());
  });

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return { screen: pos, world };
};
