import { Title } from "@solidjs/meta";
import LeftSidebar from "~/components/LeftSidebar";
import RightSidebar from "~/components/RightSidebar";
import Canvas from "~/components/Canvas";
import { handStore } from "~/stores/handStore";
import { Show } from "solid-js";
import Cursor from "~/components/Cursor";

export default function Home() {
  const [hand] = handStore;

  return (
    <>
      <Title>Zuga</Title>
      <div class="w-screen relative overflow-hidden">
        <Show when={hand.mode === "draw"}>
          <Cursor />
        </Show>
        <LeftSidebar />
        <RightSidebar />
        <Canvas />
      </div>
    </>
  );
}
