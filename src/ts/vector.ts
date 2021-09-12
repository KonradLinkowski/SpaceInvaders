import { clamp, lerp as numberLerp } from './math';
export interface Vector {
  x: number;
  y: number;
}

export function normalize(vector: Vector) {
  const mag = magnitude(vector);
  return {
    x: mag ? vector.x / mag : 0,
    y: mag ? vector.y / mag : 0
  };
}

export function magnitude(vector: Vector) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

export function slerp(start: Vector, end: Vector, percent: number): Vector
{
  percent = clamp(0, 1, percent);
  const dt = dot(start, end);
  const theta = Math.acos(dt) * percent;
  const relative = normalize(subtract(end, mulFactor(start, dt)));
  return normalize(
    add(
      mulFactor(start, Math.cos(theta)),
      mulFactor(relative, Math.sin(theta))
    )
  );
}

export function lerp(start: Vector, end: Vector, percent: number) {
  return {
    x: numberLerp(start.x, end.x, percent),
    y: numberLerp(start.y, end.y, percent)
  };
}

export function dot(a: Vector, b: Vector) {
  return a.x * b.x + a.y * b.y;
}

export function add(a: Vector, b: Vector) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export function subtract(a: Vector, b: Vector) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

export function mulFactor(vector: Vector, factor: number) {
  return {
    x: vector.x * factor,
    y: vector.y * factor
  };
}

export function distance(a: Vector, b: Vector): number {
  return magnitude({
    x: a.x - b.x,
    y: a.y - b.y
  });
}
