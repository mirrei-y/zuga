import { JSX } from "solid-js";

export default function KeyValue(props: {
  key: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col justify-between gap-2">
      <span class="text-slate-600">{props.key}</span>
      <div>{props.children}</div>
    </div>
  );
}
