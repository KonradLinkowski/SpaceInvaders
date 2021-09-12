import { GAMEPAD_EPSILON, PLAYER_SPEED, FIRE_COOLDOWN, PROJECTILE_SPEED, PROJECTILE_SIZE, ENEMY_SIZE, PLAYER_OFFSET } from './config';
import { advanceEnemy, createEnemy, Enemy, Type } from './enemy';
import { Input } from './input';
import { distance, PolarVector, toPolarVector } from './polar-vector';
import { magnitude, slerp, mulFactor, Vector, normalize } from './vector';

export interface Projectile {
  position: PolarVector;
}

export interface PhysicsData {
  input: Input;
  deltaTime: number;
}

export interface PhysicsOutput {
  playerPosition: Vector;
  projectiles: Projectile[];
  enemies: Enemy[];
}

let currentPosition: Vector = {
  x: 0,
  y: 1
};

let destination: Vector = {
  x: 0,
  y: 1
};


const projectiles: Projectile[] = [];

const enemies: Enemy[] = [
  createEnemy(Type.Basic),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
  createEnemy(Type.ZigZag),
];

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
      position: { ...toPolarVector(mulFactor(currentPosition, 50)) }
    })
  }

  for (const projectile of projectiles) {
    projectile.position.radius += deltaTime * PROJECTILE_SPEED;
  }

  for (const enemy of enemies) {
    advanceEnemy({
      enemy,
      deltaTime,
    });
  }


  projectiles:
  for (const pKey in projectiles) {
    for (const eKey in enemies) {
      const projectile = projectiles[pKey];
      const enemy = enemies[eKey];
      const dist = distance(projectile.position, enemy.position);
      if (dist < PROJECTILE_SIZE + ENEMY_SIZE) {
        projectiles.splice(+pKey, 1);
        enemies.splice(+eKey, 1);
        continue projectiles;
      }
    }
  }

  return {
    playerPosition: mulFactor(currentPosition, PLAYER_OFFSET),
    projectiles,
    enemies
  };
}
