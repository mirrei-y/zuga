import { createMemo } from "solid-js";
import { useCursorPos } from "~/composables/useCursorPos";
import { useSnap } from "~/composables/useSnap";

export default function Cursor() {
  const cursorPos = useCursorPos();
  const snap = useSnap();
  const snappedCursorPos = createMemo(() => snap(cursorPos.world()));
  return (
    <div
      class="absolute w-4 h-4 rounded-full bg-cyan-800 opacity-20 pointer-events-none"
      style={{
        top: snappedCursorPos().screen.y - 8 + "px",
        left: snappedCursorPos().screen.x - 8 + "px",
      }}
    ></div>
  );
}
