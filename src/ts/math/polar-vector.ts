import { magnitude, Vector } from './vector';

export interface PolarVector {
  angle: number;
  radius: number;
}

export function toVector(polarVector: PolarVector): Vector {
  return {
    x: polarVector.radius * Math.cos(polarVector.angle),
    y: polarVector.radius * Math.sin(polarVector.angle)
  };
}

export function toPolarVector(vector: Vector): PolarVector {
  return {
    radius: magnitude(vector),
    angle: Math.atan2(vector.y, vector.x)
  };
}

export function distance(a: PolarVector, b: PolarVector): number {
  return Math.sqrt(a.radius ** 2 + b.radius ** 2 - 2 * a.radius * b.radius * Math.cos(a.angle - b.angle));
}
