import { Kind } from "../kind";

const colorBrand = Symbol();
const lengthBrand = Symbol();
const textBrand = Symbol();

export type Color = string & { [colorBrand]: true };
export type Length = number & { [lengthBrand]: true };
export type Text = string & { [textBrand]: true };

export type Field = Color | Length | Text;

export const asColor = (value: string): Color => {
  return Object.assign(value, { [colorBrand]: true }) as Color;
};

export const asLength = (value: number): Length => {
  return Object.assign(value, { [lengthBrand]: true }) as Length;
};

export const asText = (value: string): Text => {
  return Object.assign(value, { [textBrand]: true }) as Text;
};

export const isColor = (field: Field): field is Color => {
  return field.hasOwnProperty(colorBrand);
};

export const isLength = (field: Field): field is Length => {
  return field.hasOwnProperty(lengthBrand);
};

export const isText = (field: Field): field is Text => {
  return field.hasOwnProperty(textBrand);
};

export type OtherProps = {
  rectangle: { color: Color; strokeColor: Color; strokeWidth: Length };
  ellipse: { color: Color; strokeColor: Color; strokeWidth: Length };
  line: { color: Color; strokeWidth: Length };
  text: { content: Text; fontSize: Length; color: Color };
};

export const defaultOtherProps: { [K in Kind]: OtherProps[K] } = {
  rectangle: {
    color: asColor("transparent"),
    strokeColor: asColor("black"),
    strokeWidth: asLength(2),
  },
  ellipse: {
    color: asColor("transparent"),
    strokeColor: asColor("black"),
    strokeWidth: asLength(2),
  },
  line: { color: asColor("black"), strokeWidth: asLength(2) },
  text: {
    content: asText("Text"),
    fontSize: asLength(16),
    color: asColor("black"),
  },
};

export const defaultOtherProp = <K extends Kind>(kind: K): OtherProps[K] => {
  return defaultOtherProps[kind];
};
