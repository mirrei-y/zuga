import { Accessor, createSignal, onCleanup } from "solid-js";

export const useSampled = <T>(
  source: Accessor<T>,
  interval = 300
): Accessor<T> => {
  const [sampled, setSampled] = createSignal(source());

  const intervalId = setInterval(() => {
    setSampled(() => source());
  }, interval);

  onCleanup(() => {
    clearInterval(intervalId);
  });

  return sampled;
};
