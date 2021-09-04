import { init, Input } from './gamepad';
import { slerp, magnitude, normalize, Vector } from './vector';

const $canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const $debug = document.querySelector('#debug');

const ctx = $canvas.getContext('2d');

$canvas.width = 500;
$canvas.height = 500;

let currentPosition: Vector = {
  x: 0,
  y: 1
};

let destination: Vector = {
  x: 1,
  y: 0
};

const eps = 0.3;

const { getInput } = init(() => {
  window.requestAnimationFrame(update);
});

let lastTime = 0;

function update(time: number) {
  const deltaTime = time - lastTime;
  lastTime = time;

  const input = getInput();
  physics(input, deltaTime);
  draw();
  window.requestAnimationFrame(update);
}

function physics(input: Input, deltaTime: number) {
  const mag = magnitude(input.axes);
  if (mag > eps) {
    destination = normalize(input.axes);
  }
  currentPosition = slerp(currentPosition, destination, deltaTime / 100);
}

function draw() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(
    (currentPosition.x) * 50 + $canvas.width / 2,
    (currentPosition.y) * 50 + $canvas.height / 2,
    20, 0, Math.PI * 2
  );
  ctx.closePath();
  ctx.fill();
}
