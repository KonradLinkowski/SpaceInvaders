import { InitFunctionOutput, Input } from '.';
import { log } from '../debug';
import { normalize, Vector } from '../math/vector';

let position: Vector = {
  x: 0,
  y: 0
};

let fire = false;

export function init(): InitFunctionOutput {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  

  return {
    getInput,
    setActive(ready: () => void) {
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('mousemove', onMouseMove);
      ready();
    },
    setInactive() {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
    }
  }

  function onMouseDown() {
    fire = true;
  }
  
  function onMouseUp() {
    fire = false;
  }
  
  function onMouseMove({ clientX, clientY }: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - (rect.x + rect.width / 2);
    const y = clientY - (rect.y + rect.height / 2);
    const norm = normalize({ x, y });

    position = norm;
  }
}

function getInput(): Input {
  return {
    axes: position,
    fire: fire
  };
}
