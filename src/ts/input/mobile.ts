import { InitFunctionOutput, Input } from '.';
import { log } from '../debug';
import { Vector, normalize } from '../math/vector';

let position: Vector = {
  x: 0,
  y: 0
};

let fire = false;

export function init(): InitFunctionOutput {
  const joystick = document.querySelector('#joystick') as HTMLElement;
  const handle = document.querySelector('#handle') as HTMLElement;
  const plane = document.querySelector('#mobile-plane') as HTMLElement;
  const fireButton = document.querySelector('#button-fire');
  

  return {
    getInput,
    setActive,
    setInactive
  }

  function setActive(ready: () => void) {
    handle.addEventListener('touchstart', onHandleGrab);
    handle.addEventListener('touchend', onHandleRelease);
    plane.addEventListener('touchmove', onMove);
    fireButton.addEventListener('touchstart', onFireGrab, false);
    fireButton.addEventListener('touchend', onFireRelease, false);
    fireButton.removeEventListener('touchcancel', onFireRelease, false);

    plane.hidden = false;
    ready();
  }

  function setInactive() {
    handle.removeEventListener('touchstart', onHandleGrab);
    handle.removeEventListener('touchend', onHandleRelease);
    plane.removeEventListener('touchmove', onMove);
    fireButton.removeEventListener('touchstart', onFireGrab);
    fireButton.removeEventListener('touchend', onFireRelease);
    fireButton.removeEventListener('touchcancel', onFireRelease);
    plane.hidden = true;
  }

  function onMove(event: TouchEvent) {
    event.preventDefault();

    if (!moving) return;
    const touch = event.touches[0];
    const rect = joystick.getBoundingClientRect();
    const x = touch.pageX - (rect.x + rect.width / 2);
    const y = touch.pageY - (rect.y + rect.height / 2);

    const { x: nx, y: ny } = normalize({ x, y });

    position = {
      x: nx,
      y: ny
    };

    handle.style.transform = `translate(${nx * 56.26}px, ${ny * 56.25}px)`;
  }
}

let moving = false;

function getInput(): Input {
  return {
    axes: position,
    fire
  };
}

function onHandleGrab() {
  moving = true;
}

function onHandleRelease() {
  moving = false;
}

function onFireGrab() {
  fire = true;
}

function onFireRelease() {
  fire = false;
}
