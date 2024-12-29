const board = document.getElementById('board');
const result = document.getElementById('result');
const restartButton = document.getElementById('restart');
const turnIndicator = document.getElementById('turn-indicator');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const resetScoreButton = document.getElementById('reset-score');

let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);
let score = { X: 0, O: 0 };

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Update turn indicator
function updateTurnIndicator() {
    document.body.classList.remove('red-turn', 'blue-turn');
    turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
    if (currentPlayer === 'X') {
        document.body.classList.add('red-turn');
    } else {
        document.body.classList.add('blue-turn');
    }
}

// Update score display
function updateScore() {
    scoreX.textContent = score.X;
    scoreO.textContent = score.O;
}

// Create the board
function createBoard() {
    board.innerHTML = '';
    boardState.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        cellElement.textContent = cell;
        if (cell === 'X') cellElement.classList.add('x');
        if (cell === 'O') cellElement.classList.add('o');
        board.appendChild(cellElement);
    });
    updateTurnIndicator();
}

// Handle cell click
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || boardState[index]) {
        return;
    }

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase(), 'taken');

    if (checkWin()) {
        result.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        score[currentPlayer]++;
        updateScore();
        return;
    }

    if (boardState.every(cell => cell)) {
        result.textContent = 'It\'s a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
}

// Check if a player has won
function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => boardState[index] === currentPlayer);
    });
}

// Restart the game
function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    boardState = Array(9).fill(null);
    result.textContent = '';
    createBoard();
}

// Reset score
function resetScore() {
    score = { X: 0, O: 0 };
    updateScore();
}

restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScore);

// Initialize the board
createBoard();
