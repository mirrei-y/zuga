import { Content } from "~/logic/content";
import { Svg } from "~/logic/meta/svgs";
import { createSignal, onMount, Show } from "solid-js";
import { handStore } from "~/stores/handStore";

export default function Item(props: { content: Content }) {
  let ref: SVGGraphicsElement | undefined;
  const [rect, setRect] = createSignal<DOMRect | undefined>();
  const [hand] = handStore;

  onMount(() => {
    if (ref) {
      setRect(ref.getBBox());
    }
  });

  return (
    <>
      <Svg content={props.content} ref={ref} />
      <Show when={hand.mode === "select" && hand.selecteds.has(props.content.uuid)}>
        <rect
          x={(rect()?.x ?? 0) - 5}
          y={(rect()?.y ?? 0) - 5}
          width={(rect()?.width ?? 0) + 10}
          height={(rect()?.height ?? 0) + 10}
          fill="none"
          stroke="blue"
          stroke-width={0.5}
          pointer-events="none"
        />
      </Show>
    </>
  );
}
