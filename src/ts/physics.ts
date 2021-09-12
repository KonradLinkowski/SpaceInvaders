import { GAMEPAD_EPSILON, PLAYER_SPEED, FIRE_COOLDOWN, PROJECTILE_SPEED, PROJECTILE_SIZE, ENEMY_SIZE, PLAYER_OFFSET, PARTICLE_LIFESPAN, CENTER_RADIUS, WORLD_SIZE, ENEMY_SPAWN_COOLDOWN } from './config';
import { advanceEnemy, createEnemy, Enemy, Type, getValue } from './enemy';
import { Input } from './input';
import { distance, PolarVector, toPolarVector, toVector } from './math/polar-vector';
import { magnitude, slerp, mulFactor, Vector, normalize, add } from './math/vector';
import { Particle, createPaticle, createBoom } from './particle';
import { toRelativeVector } from './world';

export interface Projectile {
  position: PolarVector;
}

export interface PhysicsData {
  input: Input;
  deltaTime: number;
  addPoints: (value: number) => void;
}

export interface PhysicsOutput {
  playerPosition: Vector;
  projectiles: Projectile[];
  enemies: Enemy[];
  particles: Particle[];
  gameOver: boolean;
}

let currentPosition: Vector = {
  x: 0,
  y: 1
};

let destination: Vector = {
  x: 0,
  y: 1
};

let gameOver = false;

const particles: Particle[] = [];

const projectiles: Projectile[] = [];

const enemies: Enemy[] = [
  createEnemy(Type.Basic),
];

let fireTimer = 0;

let spawnTimer = 0;

export function init() {
  return {
    calculate
  };
}

function calculate({ input, deltaTime, addPoints }: PhysicsData): PhysicsOutput {
  for (const pKey in particles) {
    const particle = particles[pKey];
    particle.age += deltaTime;
    if (particle.age > PARTICLE_LIFESPAN) {
      particles.splice(+pKey, 1);
      continue;
    }
    particle.position = add(particle.position, particle.velocity);
  }

  if (!gameOver) {
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

    spawnTimer += deltaTime;

    if (spawnTimer > ENEMY_SPAWN_COOLDOWN) {
      spawnTimer = 0;
      const angle = Math.random() * Math.PI * 2;
      const types = Object.values(Type);
      enemies.push(
        createEnemy(
          types[Math.random() * types.length | 0],
          { angle, radius: WORLD_SIZE / 2 }
        )
      );
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

    for (const enemy of enemies) {
      if (enemy.position.radius < CENTER_RADIUS + ENEMY_SIZE) {
        gameOver = true;
        for (let i = 0; i < 10; i += 1) {
          setTimeout(() => particles.push(
            ...createBoom({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 }, 4 + i * 4 )
          ), 100 * i);
        }
        break;
      }
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
          const position = toRelativeVector(enemy.position);
          particles.push(
            ...createBoom(position)
          );
          addPoints(getValue(enemy.type));
          continue projectiles;
        }
      }
    }
  }

  return {
    playerPosition: mulFactor(currentPosition, PLAYER_OFFSET),
    projectiles,
    enemies,
    particles,
    gameOver
  };
}
