import { Projectile } from './physics';
import { Vector } from './vector';

export interface DrawData {
  playerPosition: Vector,
  projectiles: Projectile[]
}

export function init($canvas: HTMLCanvasElement) {
  const ctx = $canvas.getContext('2d');
  return {
    draw: (data: DrawData) => draw($canvas, ctx, data)
  };
}

function draw($canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, { playerPosition, projectiles }: DrawData) {
  drawPlayer();
  drawProjectiles();

 
  function drawPlayer() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
      (playerPosition.x) * 50 + $canvas.width / 2,
      (playerPosition.y) * 50 + $canvas.height / 2,
      20, 0, Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }
  
  function drawProjectiles() {
    for (const projectile of projectiles) {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(
        (projectile.position.x) * 50 + $canvas.width / 2,
        (projectile.position.y) * 50 + $canvas.height / 2,
        5, 0, Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
    }
  }
}
