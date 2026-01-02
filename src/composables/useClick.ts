import { createSignal, onCleanup, onMount } from "solid-js";

export const useClick = () => {
  const [isDown, setIsDown] = createSignal(false);
  const [lastReleasedAt, setLastReleasedAt] = createSignal(0);

  const handleMousedown = (e: MouseEvent) => {
    setIsDown(true);
  };

  const handleMouseup = () => {
    setIsDown(false);
    setLastReleasedAt(performance.now());
  };

  onMount(() => {
    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);
    onCleanup(() => {
      window.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mouseup", handleMouseup);
    });
  });

  return {
    isDown,
    lastReleasedAt,
  };
};
