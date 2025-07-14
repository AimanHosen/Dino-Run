const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const jumpSound = document.getElementById("jumpSound");
const scoreSound = document.getElementById("scoreSound");
const gameOverSound = document.getElementById("gameOverSound");
const pauseBtn = document.getElementById("pauseBtn");
const darkToggleBtn = document.getElementById("toggleDarkMode");

const startMenu = document.getElementById("startMenu");
const pauseMenu = document.getElementById("pauseMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const finalScoreText = document.getElementById("finalScoreText");

const backgroundLayer = document.getElementById("backgroundLayer");
const roadLayer = document.getElementById("roadLayer");

let isJumping = false;
let isPaused = false;
let isGameRunning = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let scoreInterval;

function resetGame() {
  isJumping = false;
  isPaused = false;
  isGameRunning = false;
  score = 0;

  startMenu.style.display = "none";
  pauseMenu.style.display = "none";
  gameOverMenu.style.display = "none";
  pauseBtn.style.display = "block";

  cactus.style.animation = "none";
  cactus.style.right = "-10vw";

  updateScore(0);
  highScoreEl.textContent = `High Score: ${highScore}`;
}

function startGame() {
  resetGame();

  cactus.style.animation = "moveCactus 1.3s linear infinite"; // faster run
  isGameRunning = true;

  scoreInterval = setInterval(() => {
    if (isGameRunning && !isPaused) {
      score++;
      updateScore(score);
      if (score % 100 === 0) scoreSound.play();
    }
  }, 80);
}

function updateScore(val) {
  scoreEl.textContent = `Score: ${val}`;
  if (val > highScore) {
    highScore = val;
    localStorage.setItem("highScore", val);
    highScoreEl.textContent = `High Score: ${val}`;
  }
}

function jump() {
  if (isJumping || !isGameRunning || isPaused) return;
  isJumping = true;
  dino.style.animation = "jump 0.6s ease-in-out";
  jumpSound.play();
  setTimeout(() => {
    dino.style.animation = "";
    isJumping = false;
  }, 600);
}

function checkCollision() {
  const dinoRect = dino.getBoundingClientRect();
  const cactusRect = cactus.getBoundingClientRect();

  if (
    dinoRect.right > cactusRect.left + 20 &&
    dinoRect.left < cactusRect.right - 20 &&
    dinoRect.bottom > cactusRect.top + 15
  ) {
    gameOver();
  }
}

function gameOver() {
  clearInterval(scoreInterval);
  cactus.style.animation = "none";
  gameOverSound.play();
  isGameRunning = false;
  pauseBtn.style.display = "none";
  finalScoreText.textContent = `Your Score: ${score}`;
  gameOverMenu.style.display = "block";
}

function pauseGame() {
  isPaused = true;
  pauseMenu.style.display = "block";
  pauseBtn.style.display = "none";
  cactus.style.animationPlayState = "paused";
}

function resumeGame() {
  isPaused = false;
  pauseMenu.style.display = "none";
  pauseBtn.style.display = "block";
  cactus.style.animationPlayState = "running";
}

setInterval(() => {
  if (isGameRunning && !isPaused) checkCollision();
}, 50);

// Controls
document.getElementById("startGameBtn").onclick = startGame;
document.getElementById("resumeBtn").onclick = resumeGame;
document.getElementById("restartBtn").onclick = startGame;
document.getElementById("playAgainBtn").onclick = startGame;
pauseBtn.onclick = pauseGame;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
document.addEventListener("touchstart", jump);

// Day/Night toggle button logic with icons
darkToggleBtn.textContent = "☀️";

darkToggleBtn.onclick = () => {
  const isNight = backgroundLayer.classList.toggle("night");
  roadLayer.classList.toggle("night", isNight);

  if (isNight) {
    darkToggleBtn.textContent = "🌙";
  } else {
    darkToggleBtn.textContent = "☀️";
  }
};

// Show start menu initially
startMenu.style.display = "block";