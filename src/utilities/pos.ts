const screenSymbol = Symbol();
const worldSymbol = Symbol();

export type NaivePos = { x: number; y: number };
export type DeltaPos = { x: number; y: number };
export type ScreenPos = { x: number; y: number } & { [screenSymbol]: unknown };
export type WorldPos = { x: number; y: number } & { [worldSymbol]: unknown };

export const asScreenPos = (pos: { x: number; y: number }): ScreenPos => {
  return pos as ScreenPos;
};

export const asWorldPos = (pos: { x: number; y: number }): WorldPos => {
  return pos as WorldPos;
};
