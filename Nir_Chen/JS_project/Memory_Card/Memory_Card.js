// script.js
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameBoard = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");
const resetScoresButton = document.getElementById("reset-scores");
const returnToModeButton = document.getElementById("return-to-mode");
const scoreboard = document.getElementById("scoreboard");
const player1Score = document.getElementById("score1");
const player2Score = document.getElementById("score2");

let cardData = [
  { id: 1, symbol: "🍎" },
  { id: 2, symbol: "🍌" },
  { id: 3, symbol: "🍇" },
  { id: 4, symbol: "🍒" },
  { id: 1, symbol: "🍎" },
  { id: 2, symbol: "🍌" },
  { id: 3, symbol: "🍇" },
  { id: 4, symbol: "🍒" },

  { id: 11, symbol: "🎂" },
  { id: 12, symbol: "🎈" },
  { id: 13, symbol: "✨" },
  { id: 14, symbol: "🍵" },
  { id: 11, symbol: "🎂" },
  { id: 12, symbol: "🎈" },
  { id: 13, symbol: "✨" },
  { id: 14, symbol: "🍵" },
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let isTwoPlayer = false;
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

function createBoard() {
  gameBoard.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  const shuffledCards = [...cardData].sort(() => Math.random() - 0.5);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    const front = document.createElement("div");
    front.classList.add("front");
    front.textContent = card.symbol;

    const back = document.createElement("div");
    back.classList.add("back");

    cardElement.appendChild(front);
    cardElement.appendChild(back);
    gameBoard.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  const clickedCard = event.target.parentElement;

  if (
    !clickedCard.classList.contains("card") ||
    lockBoard ||
    clickedCard.classList.contains("flip")
  ) {
    return;
  }

  clickedCard.classList.add("flip");

  if (!firstCard) {
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    lockBoard = true;

    if (firstCard.dataset.id === secondCard.dataset.id) {
      if (isTwoPlayer) {
        playerScores[currentPlayer]++;
        updateScores();
      }
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        firstCard = null;
        secondCard = null;

        if (isTwoPlayer) {
          currentPlayer = currentPlayer === 1 ? 2 : 1;
          updateBackground();
        }
        lockBoard = false;
      }, 1000);
    }
  }
}

function updateScores() {
  player1Score.textContent = playerScores[1];
  player2Score.textContent = playerScores[2];
}

function updateBackground() {
  document.body.style.backgroundColor =
    currentPlayer === 1 ? "lightcoral" : "lightblue";
}

function resetScores() {
  playerScores = { 1: 0, 2: 0 };
  updateScores();
}

function resetGame() {
  createBoard(); // Reset the game board
  if (isTwoPlayer) updateBackground(); // Maintain the current player's turn background
}

function returnToModeSelection() {
  gameContainer.style.display = "none";
  startScreen.style.display = "block";
  document.body.style.backgroundColor = "#f0f0f0";
}

function startGame(twoPlayerMode) {
  isTwoPlayer = twoPlayerMode;
  startScreen.style.display = "none";
  gameContainer.style.display = "block";

  if (isTwoPlayer) {
    scoreboard.style.display = "flex";
    resetScoresButton.style.display = "inline-block"; // Show Reset Scores button
    document.body.style.backgroundColor = "lightcoral"; // Player 1 starts
  } else {
    scoreboard.style.display = "none";
    resetScoresButton.style.display = "none"; // Hide Reset Scores button
    document.body.style.backgroundColor = "#f0f0f0";
  }

  createBoard();
}

document
  .getElementById("one-player")
  .addEventListener("click", () => startGame(false));
document
  .getElementById("two-players")
  .addEventListener("click", () => startGame(true));
resetButton.addEventListener("click", resetGame);
resetScoresButton.addEventListener("click", resetScores);
returnToModeButton.addEventListener("click", returnToModeSelection);

gameBoard.addEventListener("click", handleCardClick);
