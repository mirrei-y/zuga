import { createSignal, onCleanup, onMount } from "solid-js";
import { Pos } from "~/utilities/pos";

export const useCursorPos = () => {
  const [pos, setPos] = createSignal({ x: 0, y: 0 } as Pos);

  const updatePos = (x: number, y: number) => {
    setPos({ x, y });
  };

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return pos;
};
