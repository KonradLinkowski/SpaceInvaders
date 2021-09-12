import { log } from './debug';
import { init as initInput, InputSource } from './input';
import { init as initRenderer } from './render';
import { init as initPhysics } from './physics';
import { init as initMenu } from './menu';

const $canvas = document.querySelector('#canvas') as HTMLCanvasElement;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let menuPause = true;
let inputPause = true;

const { getInput, setInputSource } = initInput(
  InputSource.Mouse,
  () => {
    inputPause = false;
  }, () => {
    inputPause = true;
  }
);

initMenu(() => {
  menuPause = false;
}, () => {
  menuPause = true;
}, (source: InputSource) => {
  setInputSource(source);
});

const { calculate } = initPhysics();

const { draw } = initRenderer($canvas);

let lastTime = 0;

window.requestAnimationFrame(update);

function update(time: number) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  window.requestAnimationFrame(update);
  if (menuPause || inputPause) return;

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
}

function resizeCanvas() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
}
