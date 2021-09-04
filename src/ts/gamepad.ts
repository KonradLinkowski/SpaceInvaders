export interface Input {
  axes: {
    x: number;
    y: number;
  };
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
  const gamepad = navigator.getGamepads()[0];
  if (gamepad) {
    const axes = {
      x: gamepad.axes[0],
      y: gamepad.axes[1]
    };
    
    return {
      axes
    };
  }
}
