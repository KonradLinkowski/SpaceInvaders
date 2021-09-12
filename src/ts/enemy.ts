import { PolarVector, toVector } from './math/polar-vector';

export enum Type {
  Basic = 'Basic',
  Spinner = 'Spinner',
  ZigZag = 'ZigZag'
}

export interface Enemy {
  initialPosition: PolarVector;
  position: PolarVector;
  type: Type;
  age: number;
  speed: number;
}

export interface NextPositionData {
  enemy: Enemy;
  deltaTime: number;
}

export function createEnemy(type: Type, position?: PolarVector): Enemy {
  const pos = position || { angle: Math.random() * Math.PI * 2, radius: 400 };
  return {
    age: 0,
    initialPosition: pos,
    position: pos,
    type,
    speed: Math.random() * 2 - 1
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
      angle: enemy.position.angle + enemy.speed * deltaTime * 1,
      radius: enemy.position.radius - deltaTime * 100
    }
    return newPos;
  },
  ZigZag({ enemy, deltaTime }: NextPositionData) {
    const angle = enemy.initialPosition.angle + enemy.speed * Math.sin(enemy.age) * Math.PI;
    const newPos = {
      angle,
      radius: enemy.position.radius - deltaTime * 50
    }
    return newPos;
  }
}

export function getValue(type: Type): number {
  switch (type) {
    case Type.Basic:
      return 5;
    case Type.Spinner:
      return 10;
    case Type.ZigZag:
      return 15;
  }
}
