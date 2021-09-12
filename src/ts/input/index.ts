import { init as initGamepad } from './gamepad';
import { init as initMobile } from './mobile';
import { init as initMouse } from './mouse';

export interface Input {
  axes: {
    x: number;
    y: number;
  };
  fire: boolean;
}

export interface InitFunctionOutput {
  getInput: () => Input;
  setActive: (ready: () => void, stop: () => void) => void;
  setInactive: () => void;
};

export enum InputSource {
  Gamepad = 'Gamepad',
  Mouse = 'Mouse',
  Mobile = 'Mobile'
}

let inputSource: InputSource = null;
let inputFunction: InitFunctionOutput = null;

export function init(source: InputSource, ready: () => void, stop: () => void) {
  const gamepad = initGamepad();
  const mouse = initMouse();
  const mobile = initMobile();
  setInputSource(source);

  return {
    getInput,
    setInputSource,
    getInputSource
  };

  function setInputSource(source: InputSource) {
    inputSource = source;
    if (inputFunction) {
      inputFunction.setInactive();
    }
    inputFunction = getInputFunction(source);
    inputFunction.setActive(ready, stop);
  }

  function getInputFunction(source: InputSource): InitFunctionOutput  {
    switch (source) {
      case InputSource.Gamepad:
        return gamepad;
      case InputSource.Mobile:
        return mobile;
      case InputSource.Mouse:
        return mouse;
    }
  }
}

function getInput(): Input {
  return inputFunction.getInput();
}

function getInputSource(): InputSource {
  return inputSource;
}
