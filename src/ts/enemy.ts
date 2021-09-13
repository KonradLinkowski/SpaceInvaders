import { PolarVector, toVector } from './math/polar-vector';
import { WORLD_SIZE } from './config';

export enum Type {
  Basic = 'Basic',
  Spinner = 'Spinner',
  ZigZag = 'ZigZag',
  Oscillator = 'Oscillator'
}

export interface Enemy {
  initialPosition: PolarVector;
  position: PolarVector;
  type: Type;
  age: number;
  direction: number;
}

export interface NextPositionData {
  enemy: Enemy;
  deltaTime: number;
}

export function createEnemy(type: Type, position?: PolarVector): Enemy {
  const pos = position || { angle: Math.random() * Math.PI * 2, radius: WORLD_SIZE };
  return {
    age: 0,
    initialPosition: pos,
    position: pos,
    type,
    direction: [-1, 1][Math.random() * 2 | 0]
  };
}

export function advanceEnemy(data: NextPositionData): void {
  data.enemy.age += data.deltaTime;
  data.enemy.position = movePatterns[data.enemy.type](data);
}

const movePatterns: { [type in Type]: (data: NextPositionData) => PolarVector } = {
  Basic({ enemy, deltaTime }: NextPositionData) {
    const newPos = {
      angle: enemy.position.angle,
      radius: enemy.position.radius - deltaTime * 100
    }
    return newPos;
  },
  Spinner({ enemy, deltaTime }: NextPositionData) {
    const newPos = {
      angle: enemy.position.angle + enemy.direction * deltaTime * 1,
      radius: enemy.position.radius - deltaTime * 100
    }
    return newPos;
  },
  ZigZag({ enemy, deltaTime }: NextPositionData) {
    const angle = enemy.initialPosition.angle + enemy.direction * Math.sin(enemy.age) * Math.PI;
    const newPos = {
      angle,
      radius: enemy.position.radius - deltaTime * 50
    }
    return newPos;
  },
  Oscillator({ enemy, deltaTime }: NextPositionData) {
    const angle = enemy.position.angle + enemy.direction * deltaTime * 1;
    const radius = Math.sin(enemy.age * 10) * 50 + WORLD_SIZE / 2 - enemy.age * 50;
    const newPos = {
      angle,
      radius
    }
    return newPos;
  }
}

export function getValue(type: Type): number {
  const values: { [key in Type]: number } = {
    [Type.Basic]: 5,
    [Type.Spinner]: 10,
    [Type.ZigZag]: 15,
    [Type.Oscillator]: 20
  };
  return values[type];
}
