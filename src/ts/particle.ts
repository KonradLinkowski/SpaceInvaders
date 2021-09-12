import { Vector } from "./math/vector";
import { toVector } from "./math/polar-vector";
import { PARTICLE_SPEED } from "./config";

export interface Particle {
  position: Vector;
  velocity: Vector;
  age: number;
}

export function createBoom(position: Vector, count: number = 32): Particle[] {
  const particles = [];
  const alpha = Math.PI * 2 / count;
  for (let i = 0; i < count; i += 1) {
    particles.push(
      createPaticle(position, toVector({ angle: alpha * i, radius: PARTICLE_SPEED }))
    );
  }
  return particles;
}

export function createPaticle(position: Vector, velocity: Vector): Particle {
  return {
    age: 0,
    position,
    velocity
  };
}
