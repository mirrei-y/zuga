import { ScreenPos, asScreenPos } from "~/utilities/pos";

export function useDrag<T>(
  handlers: {
    onStart: (start: ScreenPos) => T;
    onMove?: (start: ScreenPos, current: ScreenPos, initial: T) => void;
    onEnd?: (start: ScreenPos, end: ScreenPos) => void;
  } = {
    onStart: () => {
      return {} as T;
    },
  }
) {
  const startDrag = (start: ScreenPos) => {
    const initial = handlers.onStart?.(start);

    const handleMove = (ev: MouseEvent) => {
      const end = asScreenPos({ x: ev.clientX, y: ev.clientY });
      handlers.onMove?.(start, end, initial);
    };

    const handleUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const end = asScreenPos({ x: ev.clientX, y: ev.clientY });
      handlers.onEnd?.(start, end);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return { startDrag };
}
