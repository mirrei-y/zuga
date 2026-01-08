import { Kind } from "../kind";

export const names: Record<Kind, string> = {
  rectangle: "四角形",
  ellipse: "楕円",
  polygon: "多角形",
  line: "線",
  text: "テキスト",
  math: "数式",
  resistor: "抵抗",
  capacitor: "コンデンサ",
  inductor: "インダクタ",
  source: "電源",
  gnd: "GND",
};
