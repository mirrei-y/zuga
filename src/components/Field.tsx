import { OtherPropField } from "~/logic/meta/fields";
import KeyValue from "./KeyValue";
import { Index, Match, Switch } from "solid-js";
import ColorPicker from "./ColorPicker";

export default function Field(props: {
  field: OtherPropField<any>;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div>
      <KeyValue key={props.field.name}>
        <Switch>
          <Match when={props.field.type === "color"}>
            <ColorPicker
              value={props.value}
              onChange={(v) => props.onChange(v)}
            />
          </Match>
          <Match when={props.field.type === "length"}>
            <input
              type="number"
              value={props.value}
              onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
              class="w-full border border-slate-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "text"}>
            <input
              type="text"
              value={props.value}
              onInput={(e) => props.onChange(e.currentTarget.value)}
              class="w-full border border-slate-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "boolean"}>
            <input
              type="checkbox"
              checked={props.value}
              onChange={(e) => props.onChange(e.currentTarget.checked)}
              class="border border-slate-300 rounded px-2 py-1"
            />
          </Match>
          <Match when={props.field.type === "select"}>
            <select
              value={props.value}
              onChange={(e) => props.onChange(e.currentTarget.value)}
              class="w-full border border-slate-300 rounded px-2 py-1"
            >
              <Index each={(props.field as any).options}>
                {(option) => (
                  <option value={option().value}>{option().label}</option>
                )}
              </Index>
            </select>
          </Match>
        </Switch>
      </KeyValue>
    </div>
  );
}
