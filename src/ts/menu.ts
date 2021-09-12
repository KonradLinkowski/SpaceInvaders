import { InputSource } from './input';

export function init(start: () => void, stop: () => void, inputChange: (source: InputSource) => void) {
  const $menu = document.querySelector('#menu') as HTMLElement;
  window.addEventListener('keydown', ({ key }: KeyboardEvent) => {
    if (key == 'Escape') {
      if ($menu.hidden) {
        show();
      } else {
        hide();
      }
    }
  });

  const $startButton = document.querySelector('#start-button') as HTMLButtonElement;
  $startButton.addEventListener('click', onStart);

  inputChange(InputSource.Mouse);

  const $radios = document.querySelector('#input-source') as HTMLElement;
  $radios.addEventListener('change', () => {
    const selected = ($radios.querySelector('input:checked') as HTMLInputElement).value;
    inputChange(InputSource[selected]);
  });

  window.addEventListener('blur', show);

  function onStart() {
    document.querySelector('html').requestFullscreen().catch(console.error);
    hide();
  }

  function show() {
    $menu.hidden = false;
    stop();
  }

  function hide() {
    $menu.hidden = true;
    start();
  }
}

