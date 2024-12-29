const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const modal = document.getElementById("gameOverModal");
const finalScore = document.getElementById("finalScore");
const closeModal = document.getElementById("closeModal");

const gridSize = 20;
let snake, snakeDirection, food, score, gameOver;

// Initialize the game state
function initializeGame() {
  snake = [{ x: 160, y: 160 }];
  snakeDirection = "RIGHT";
  food = spawnFood();
  score = 0;
  gameOver = false;
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
    checkCollisions();
    gameLoop();
  }, 100);
}

// Move the snake
function moveSnake() {
  const head = { ...snake[0] };

  switch (snakeDirection) {
    case "UP":
      head.y -= gridSize;
      break;
    case "DOWN":
      head.y += gridSize;
      break;
    case "LEFT":
      head.x -= gridSize;
      break;
    case "RIGHT":
      head.x += gridSize;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
    score++;
  } else {
    snake.pop();
  }
}

// Draw the snake with rounded corners and alternating shades of green
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#6ab04c" : "#27ae60"; // Alternating shades of green
    ctx.beginPath();
    ctx.roundRect(snake[i].x, snake[i].y, gridSize, gridSize, 4); // Rounded corners
    ctx.fill();
  }
}

// Draw the apple with a red gradient and a green stem
function drawFood() {
  const centerX = food.x + gridSize / 2;
  const centerY = food.y + gridSize / 2;
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    2,
    centerX,
    centerY,
    gridSize / 2
  );
  gradient.addColorStop(0, "#ff5e57"); // Bright red
  gradient.addColorStop(1, "#c0392b"); // Darker red
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw the apple stem
  ctx.fillStyle = "#27ae60"; // Green for the stem
  ctx.fillRect(centerX - 2, centerY - gridSize / 2 - 5, 4, 8);
}

// Spawn new food
function spawnFood() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

// Check for collisions
function checkCollisions() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    endGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// End the game and display the custom modal
function endGame() {
  gameOver = true;
  finalScore.textContent = "Your Score: " + score;
  modal.style.display = "flex"; // Show the modal
}

// Restart the game when the modal button is clicked
closeModal.addEventListener("click", () => {
  modal.style.display = "none"; // Hide the modal
  initializeGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameLoop();
});

// Restart the game when the restart button is clicked
restartButton.addEventListener("click", () => {
  initializeGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameLoop();
});

// Mobile Arrow Button Controls
document.getElementById("upBtn").addEventListener("click", () => {
  if (snakeDirection !== "DOWN") {
    snakeDirection = "UP";
  }
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (snakeDirection !== "UP") {
    snakeDirection = "DOWN";
  }
});
document.getElementById("leftBtn").addEventListener("click", () => {
  if (snakeDirection !== "RIGHT") {
    snakeDirection = "LEFT";
  }
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (snakeDirection !== "LEFT") {
    snakeDirection = "RIGHT";
  }
});

// Keyboard controls for arrow keys on desktop
document.addEventListener("keydown", (event) => {
  if (gameOver) return; // Don't change direction if the game is over
  switch (event.key) {
    case "ArrowUp":
      if (snakeDirection !== "DOWN") snakeDirection = "UP";
      break;
    case "ArrowDown":
      if (snakeDirection !== "UP") snakeDirection = "DOWN";
      break;
    case "ArrowLeft":
      if (snakeDirection !== "RIGHT") snakeDirection = "LEFT";
      break;
    case "ArrowRight":
      if (snakeDirection !== "LEFT") snakeDirection = "RIGHT";
      break;
  }
});

// Start the game
initializeGame();
gameLoop();
