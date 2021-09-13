import { ENEMY_SIZE, PLAYER_SIZE, PROJECTILE_SIZE, WORLD_SIZE, PARTICLE_SIZE, PARTICLE_LIFESPAN, CENTER_RADIUS } from './config';
import { Enemy } from './enemy';
import { Projectile } from './physics';
import { Vector } from './math/vector';
import { toRelativeVector } from './world';
import { Particle } from './particle';

export interface DrawData {
  playerPosition: Vector;
  projectiles: Projectile[];
  enemies: Enemy[];
  particles: Particle[];
}

export function init($canvas: HTMLCanvasElement) {
  const ctx = $canvas.getContext('2d');
  ctx.globalCompositeOperation = 'source-atop';
  return {
    draw: (data: DrawData) => draw($canvas, ctx, data)
  };
}

const colors = {
  enemy: `hsl(120, 100%, 50%)`,
  particle: `hsl(300, 100%, 50%)`,
  center: `hsl(260, 100%, 50%)`,
  player: `hsl(0, 100%, 50%)`,
  projectile: `hsl(60, 100%, 50%)`,
  
};

function draw(
  $canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  { playerPosition, projectiles, enemies, particles }: DrawData
) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  drawCenter();
  drawPlayer();
  drawProjectiles();
  drawEnemies();
  drawParticles();
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
      colors.center
    );

    drawCircle(
      $canvas.width / 2,
      $canvas.height / 2,
      CENTER_RADIUS,
      colors.center,
      true
    );
  }
 
  function drawPlayer() {
    drawCircle(
      playerPosition.x + $canvas.width / 2,
      playerPosition.y + $canvas.height / 2,
      PLAYER_SIZE,
      colors.player
    );
  }
  
  function drawProjectiles() {
    for (const projectile of projectiles) {
      const vector = toRelativeVector(projectile.position);
      drawCircle(
        vector.x,
        vector.y,
        PROJECTILE_SIZE,
        colors.projectile
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
        colors.enemy
      );
    }
  }

  function drawParticles() {
    for (const particle of particles) {
      const color = `rgba(255, 0, 255, ${1 - particle.age / PARTICLE_LIFESPAN})`;
      drawCircle(
        particle.position.x,
        particle.position.y,
        PARTICLE_SIZE,
        color
      );
    }
  }

  function drawCircle(x: number, y: number, r: number, color: string, hollow?: boolean) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.shadowColor = color;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 10;
    if (hollow) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
    // reset
    ctx.shadowBlur = 0;
  }
}
