import { ENEMY_SIZE, PLAYER_SIZE, PROJECTILE_SIZE, WORLD_SIZE } from './config';
import { Enemy } from './enemy';
import { Projectile } from './physics';
import { Vector } from './math/vector';
import { toRelativeVector } from './world';

export interface DrawData {
  playerPosition: Vector;
  projectiles: Projectile[];
  enemies: Enemy[];
}

export function init($canvas: HTMLCanvasElement) {
  const ctx = $canvas.getContext('2d');
  ctx.globalCompositeOperation = 'source-atop';
  return {
    draw: (data: DrawData) => draw($canvas, ctx, data)
  };
}

function draw($canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, { playerPosition, projectiles, enemies }: DrawData) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  drawCenter();
  drawPlayer();
  drawProjectiles();
  drawEnemies();
  drawMask();

  function drawMask() {
    const mask = ctx.createRadialGradient(
      WORLD_SIZE / 2,
      WORLD_SIZE / 2,
      WORLD_SIZE * 0.4,
      WORLD_SIZE / 2,
      WORLD_SIZE / 2,
      WORLD_SIZE / 2
    );
    mask.addColorStop(0, '#ffff');
    mask.addColorStop(1, '#0000');
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);
  }

  function drawCenter() {
    drawCircle(
      $canvas.width / 2,
      $canvas.height / 2,
      5,
      'purple'
    );
  }
 
  function drawPlayer() {
    drawCircle(
      playerPosition.x + $canvas.width / 2,
      playerPosition.y + $canvas.height / 2,
      PLAYER_SIZE,
      'red'
    );
  }
  
  function drawProjectiles() {
    for (const projectile of projectiles) {
      const vector = toRelativeVector(projectile.position);
      drawCircle(
        vector.x,
        vector.y,
        PROJECTILE_SIZE,
        'blue'
      );
    }
  }

  function drawEnemies() {
    for (const enemy of enemies) {
      const vector = toRelativeVector(enemy.position);
      drawCircle(
        vector.x,
        vector.y,
        ENEMY_SIZE,
        'green'
      );
    }
  }

  function drawCircle(x: number, y: number, r: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}
