import { readables, thumbnails } from "~/utilities/meta";
import { handStore } from "~/stores/handStore";
import { kinds, Kind } from "~/utilities/props";
import { For } from "solid-js";

export default function Sidebar() {
  const [hand, setHand] = handStore;

  const change = (kind: Kind) => {
    setHand({ kind, points: [] });
  };

  return (
    <aside class="absolute w-90 h-full max-w-[50%] p-2 bg-white border-r border-gray-200">
      <div class="grid grid-cols-2 h-min gap-2">
        <For each={kinds}>
          {(kind) => (
            <button
              class={`p-2 rounded-md cursor-pointer border border-gray-200
               ${
                 hand.kind == kind
                   ? "bg-cyan-800 hover:bg-cyan-700 text-white"
                   : "bg-gray-50 hover:bg-gray-100"
               }
               flex flex-row items-center gap-3`}
              on:click={() => change(kind)}
            >
              {thumbnails[kind]}
              {readables[kind]}
            </button>
          )}
        </For>
      </div>
    </aside>
  );
}
