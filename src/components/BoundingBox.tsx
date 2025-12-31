export default function BoundingBox(props: { rect: SVGRect | undefined }) {
  return (
    <rect
      x={(props.rect?.x ?? 0) - 5}
      y={(props.rect?.y ?? 0) - 5}
      width={(props.rect?.width ?? 0) + 10}
      height={(props.rect?.height ?? 0) + 10}
      fill="none"
      stroke="blue"
      stroke-width={0.5}
      pointer-events="none"
    />
  );
}
