import { log } from './debug';
import { init as initGamepad } from './gamepad';
import { init as initRenderer } from './render';
import { init as initPhysics } from './physics';

const $canvas = document.querySelector('#canvas') as HTMLCanvasElement;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const { getInput } = initGamepad(() => {
  window.requestAnimationFrame(update);
});

const { calculate } = initPhysics();

const { draw } = initRenderer($canvas);

let lastTime = 0;

function update(time: number) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  const input = getInput();
  const {
    playerPosition,
    projectiles
  } = calculate({
    input, deltaTime
  });
  draw({
    playerPosition,
    projectiles
  });
  window.requestAnimationFrame(update);
}

function resizeCanvas() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
}
