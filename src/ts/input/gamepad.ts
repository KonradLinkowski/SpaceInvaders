import { InitFunctionOutput, Input } from '.';
import { log } from '../debug';

export function init(): InitFunctionOutput {
  let bready = () => {};
  let bstop = () => {};

  return {
    getInput,
    setActive,
    setInactive
  };

  function setActive(ready: () => void, stop: () => void) {
    bready = ready;
    bstop = stop;

    window.addEventListener("gamepadconnected", onConnected, false);
    window.addEventListener("gamepaddisconnected", onDisconncted, false);
  }

  function setInactive() {
    window.removeEventListener("gamepadconnected", onConnected, false);
    window.removeEventListener("gamepaddisconnected", onDisconncted, false);
  }

  function onConnected({ gamepad }: GamepadEvent) {
    console.log('connected', gamepad);
    bready();
  }
  
  function onDisconncted({ gamepad }: GamepadEvent) {
    console.log('disconnected', gamepad);
    bstop();
  }
}

function getInput(): Input {
  const gamepads = navigator.getGamepads();
  if (!gamepads) return;
  const gamepad = Object.values(gamepads).find(gp => gp);
  if (!gamepad) return;


  const axes = {
    x: gamepad.axes[0],
    y: gamepad.axes[1]
  };
  
  return {
    axes,
    fire: [0, 5, 7].map(i => gamepad.buttons[i]).some(button => button.pressed)
  };
}
