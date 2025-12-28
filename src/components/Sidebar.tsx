import { readables } from "~/utilities/meta";
import { drawingStateStore } from "~/stores/drawingStateStore";
import { kinds, Kind } from "~/utilities/props";
import { thumbnails } from "~/utilities/thumbnail";

export default function Sidebar() {
  const [drawingState, setDrawingState] = drawingStateStore;

  const change = (kind: Kind) => {
    setDrawingState({ kind, points: [] });
  };

  return (
    <aside class="absolute w-90 h-full max-w-[50%] p-2 bg-white border-r border-gray-200">
      <div class="grid grid-cols-2 h-min gap-2">
        {
          kinds.map(kind => (
            <button
              class={
                `p-2 rounded-md cursor-pointer border border-gray-200
               ${drawingState.kind == kind ? 'bg-cyan-800 hover:bg-cyan-700 text-white' : 'bg-gray-50 hover:bg-gray-100'}
               flex flex-row items-center gap-3`
              }
              on:click={() => change(kind)}>
              {thumbnails[kind]}
              {readables[kind]}
            </button>
          ))
        }
      </div>
    </aside>
  )
}
