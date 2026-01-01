import { ScreenPos } from "~/utilities/pos";

export function useDrag(handlers: {
  onStart?: () => void;
  onMove?: (delta: { x: number; y: number }) => void;
  onEnd?: (delta: { x: number; y: number }) => void;
}) {
  const startDrag = (start: ScreenPos) => {
    handlers.onStart?.();

    const handleMove = (e: MouseEvent) => {
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      };
      handlers.onMove?.(delta);
    };

    const handleUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      };
      handlers.onEnd?.(delta);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return startDrag;
}
