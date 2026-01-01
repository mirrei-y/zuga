const normalizeRect = (rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  const normalizedWidth = Math.abs(rect.width);
  const normalizedHeight = Math.abs(rect.height);
  const normalizedX = rect.width < 0 ? rect.x - normalizedWidth : rect.x;
  const normalizedY = rect.height < 0 ? rect.y - normalizedHeight : rect.y;

  return {
    x: normalizedX,
    y: normalizedY,
    width: normalizedWidth,
    height: normalizedHeight,
  };
};

export const isCollidingRectAndRect = (
  rectA: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  rectB: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
): boolean => {
  rectA = normalizeRect(rectA);
  rectB = normalizeRect(rectB);
  return !(
    rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y
  );
};

export const isCollidingRectAndPoint = (
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  point: {
    x: number;
    y: number;
  }
): boolean => {
  return (
    rect.x <= point.x &&
    point.x <= rect.x + rect.width &&
    rect.y <= point.y &&
    point.y <= rect.y + rect.height
  );
};
