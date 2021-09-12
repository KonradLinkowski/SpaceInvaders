import { log } from './debug';
import { init as initInput, InputSource } from './input';
import { init as initRenderer } from './render';
import { init as initPhysics } from './physics';

const $canvas = document.querySelector('#canvas') as HTMLCanvasElement;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let animationHandle = null;

const { getInput, setInputSource } = initInput(
  InputSource.Mouse,
  () => {
    animationHandle = window.requestAnimationFrame(update);
  },
  () => {
    if (!animationHandle) return;
    window.cancelAnimationFrame(animationHandle);
    animationHandle = null;
  }
);

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
  animationHandle = window.requestAnimationFrame(update);
}

function resizeCanvas() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
}
