export function clamp(min: number, max: number, v: number) {
  return v > max ? max : v < min ? min : v;
}
