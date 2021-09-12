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
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  drawCenter();
  drawPlayer();
  drawProjectiles();


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
      (playerPosition.x) * 50 + $canvas.width / 2,
      (playerPosition.y) * 50 + $canvas.height / 2,
      20,
      'red'
    );
  }
  
  function drawProjectiles() {
    for (const projectile of projectiles) {
      drawCircle(
        (projectile.position.x) * 50 + $canvas.width / 2,
        (projectile.position.y) * 50 + $canvas.height / 2,
        5,
        'blue'
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
