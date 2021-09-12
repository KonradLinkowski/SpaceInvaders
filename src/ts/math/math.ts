export function clamp(min: number, max: number, v: number) {
  return v > max ? max : v < min ? min : v;
}

export function lerp(start: number, end: number, v: number) {
  return start + (end - start) * v;
}
