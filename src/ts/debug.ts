const $debug = document.querySelector('#debug');

export function log(...data: any[]) {
  $debug.textContent = data.join('\n');
}
