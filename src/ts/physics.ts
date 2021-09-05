import { GAMEPAD_EPSILON, PLAYER_SPEED, FIRE_COOLDOWN, PROJECTILE_SPEED } from './config';
import { Input } from './gamepad';
import { magnitude, slerp, add, mulFactor, Vector, normalize } from './vector';

export interface Projectile {
  position: Vector;
  direction: Vector;
}

export interface PhysicsData {
  input: Input;
  deltaTime: number;
}

export interface PhysicsOutput {
  playerPosition: Vector;
  projectiles: Projectile[];
}

let currentPosition: Vector = {
  x: 0,
  y: 1
};

let destination: Vector = {
  x: 0,
  y: 1
};


const projectiles = [];

let fireTimer = 0;

export function init() {
  return {
    calculate
  };
}

function calculate({ input, deltaTime }: PhysicsData): PhysicsOutput {
  const mag = magnitude(input.axes);
  if (mag > GAMEPAD_EPSILON) {
    destination = normalize(input.axes);
  }
  currentPosition = slerp(currentPosition, destination, deltaTime * PLAYER_SPEED);


  fireTimer += deltaTime;

  if (input.fire && fireTimer > FIRE_COOLDOWN) {
    fireTimer = 0;
    projectiles.push({
      position: { ...currentPosition },
      direction: { ...currentPosition }
    })
  }

  for (const projectile of projectiles) {
    projectile.position = add(projectile.position, (mulFactor(projectile.direction, deltaTime * PROJECTILE_SPEED)));
  }

  return {
    playerPosition: currentPosition,
    projectiles
  };
}
