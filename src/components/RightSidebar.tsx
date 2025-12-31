import { For, Index, Match, Show, Switch } from "solid-js";
import h from "solid-js/h";
import {
  asColor,
  asLength,
  asText,
  Field,
  isColor,
  isLength,
  isText,
} from "~/logic/meta/otherProps";
import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";

export default function RightSidebar() {
  const [hand] = handStore;
  const [contents, setContents] = contentsStore;

  const target = () =>
    hand.mode == "select" && hand.selecteds.size === 1
      ? contents.contents[hand.selecteds.values().toArray()[0]]
      : null;

  const mutate = (key: string, value: Field) => {
    if (!target()) return;
    setContents({
      contents: {
        ...contents.contents,
        [target()!.uuid]: {
          ...target()!,
          otherProps: {
            ...target()!.otherProps,
            [key]: value,
          },
        },
      },
    });
  };

  return (
    <>
      <aside
        class="absolute w-90 max-w-[50%] h-screen p-4 bg-white/50 border-l border-gray-200 transition-[right]"
        style={{
          right: target() ? "0px" : "calc(var(--spacing) * -90)",
        }}
      >
        <Show when={target()}>
          {(target) => (
            <div class="flex flex-col gap-4">
              <Index
                each={Object.entries(target().otherProps).map(([k, v]) => ({
                  k,
                  v,
                }))}
              >
                {(prop) => (
                  <Switch>
                    <Match when={isColor(prop().v)}>
                      <span>{prop().k}</span>
                      <input
                        type="color"
                        value={prop().v}
                        onInput={(e) => {
                          mutate(prop().k, asColor(e.currentTarget.value));
                        }}
                      />
                    </Match>
                    <Match when={isLength(prop().v)}>
                      <span>{prop().k}</span>
                      <input
                        type="number"
                        value={prop().v}
                        onInput={(e) => {
                          mutate(
                            prop().k,
                            asLength(Number(e.currentTarget.value))
                          );
                        }}
                      />
                    </Match>
                    <Match when={isText(prop().v)}>
                      <span>{prop().k}</span>
                      <input
                        type="text"
                        value={prop().v}
                        onInput={(e) => {
                          mutate(prop().k, asText(e.currentTarget.value));
                        }}
                      />
                    </Match>
                  </Switch>
                )}
              </Index>
            </div>
          )}
        </Show>
      </aside>
    </>
  );
}
