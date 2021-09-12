const HIGHSCORE_KEY = 'psi_highscore';

export function init() {
  let {
    highscore,
    score
  } = loadPoints();
  const $score = document.querySelector('#score');
  const $gameOverScore = document.querySelector('#game-over-score');
  const $gameOverHighscore = document.querySelector('#game-over-highscore');
  const $gameOverButton = document.querySelector('#game-over-button');
  $gameOverButton.addEventListener('click', () => location.reload());

  return {
    addPoints
  };

  function addPoints(value: number) {
    score += value;
    if (score > highscore) {
      highscore = score;
    }
    updateUI();
    savePoints();
  }

  function savePoints() {
    localStorage.setItem(HIGHSCORE_KEY, String(highscore));
  }
  
  function loadPoints() {
    const highscore = localStorage.getItem(HIGHSCORE_KEY);
    return {
      score: 0,
      highscore: highscore ? +highscore : 0
    };
  }

  function updateUI() {
    $score.textContent = String(score);
    $gameOverScore.textContent = String(score);
    $gameOverHighscore.textContent = String(highscore);
  }
}
