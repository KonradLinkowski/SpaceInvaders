import { log } from './debug';
import { init as initInput, InputSource } from './input';
import { init as initRenderer } from './render';
import { init as initPhysics } from './physics';
import { init as initMenu } from './menu';
import { init as initScore } from './score';
import { init as initBackground } from './background';
import { WORLD_SIZE } from './config';

initBackground();

const $canvas = document.querySelector('#canvas') as HTMLCanvasElement;
$canvas.width = WORLD_SIZE;
$canvas.height = WORLD_SIZE;

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

const { setGameOver } = initMenu(() => {
  menuPause = false;
}, () => {
  menuPause = true;
}, (source: InputSource) => {
  inputPause = true;
  setInputSource(source);
});

const { addPoints } = initScore();

const { calculate } = initPhysics();

const { draw } = initRenderer($canvas);

let lastTime = 0;

addPoints(0);

window.requestAnimationFrame(update);

function update(time: number) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  window.requestAnimationFrame(update);
  if (menuPause || inputPause) return;

  const input = getInput();
  const {
    playerPosition,
    projectiles,
    enemies,
    particles,
    gameOver
  } = calculate({
    input, deltaTime, addPoints
  });
  draw({
    playerPosition,
    projectiles,
    enemies,
    particles
  });

  if (gameOver) {
    setGameOver();
  }
}
