import { log } from './debug';

export interface Input {
  axes: {
    x: number;
    y: number;
  };
  fire: boolean;
}

export function init(connected: () => void) {
  window.addEventListener("gamepadconnected", onConnected, false);
  window.addEventListener("gamepaddisconnected", onDisconncted, false);

  return {
    getInput
  }

  function onConnected({ gamepad }: GamepadEvent) {
    console.log('connected', gamepad);
    connected();
  }
  
  function onDisconncted({ gamepad }: GamepadEvent) {
    console.log('disconnected', gamepad);
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
