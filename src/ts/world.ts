import { WORLD_SIZE } from './config';
import { PolarVector, toVector } from './math/polar-vector';
import { Vector } from './math/vector';

export function toRelativeVector(polarVector: PolarVector): Vector {
  const vec = toVector(polarVector);
  return {
    x: vec.x + WORLD_SIZE / 2,
    y: vec.y + WORLD_SIZE / 2
  };
}
