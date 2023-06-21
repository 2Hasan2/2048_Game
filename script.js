// Initialize the game state
var board = [];
var size = 4
var score = 0;
var isGameOver = false;
var bestScoreElement = document.getElementById("best-score");
var scoreElement = document.getElementById("score");
var gameContainer = document.getElementById("game-container");
var resetBtn = document.getElementById("reset");

// Function to create the game board
function createBoard() {
  for (var i = 0; i < 4; i++) {
    board[i] = [];
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
    }
  }
}

// Function to generate a new tile (2 or 4) in a random empty cell
function generateTile() {
  var emptyCells = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    var randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Function to render the game board
function renderBoard() {
  gameContainer.innerHTML = "";
  gameContainer.style.cssText = `
  grid-template-columns: repeat(${size}, 1fr);
  grid-template-rows: repeat(${size}, 1fr);
  `
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var cell = document.createElement("div");
      cell.className = "game-cell";
      cell.textContent = board[i][j] === 0 ? "" : board[i][j];
      cell.style.backgroundColor = getTileColor(board[i][j]);
      gameContainer.appendChild(cell);
    }
  }
}

// Function to get the tile color based on its value
function getTileColor(value) {
  switch (value) {
    case 2:
      return "#eee4da";
    case 4:
      return "#ede0c8";
    case 8:
      return "#f2b179";
    case 16:
      return "#f59563";
    case 32:
      return "#f67c5f";
    case 64:
      return "#f65e3b";
    case 128:
      return "#edcf72";
    case 256:
      return "#edcc61";
    case 512:
      return "#edc850";
    case 1024:
      return "#edc53f";
    case 2048:
      return "#edc22e";
    default:
      return "#eee";
  }
}

// Function to handle touch events
function handleTouchStart(event) {
  if (isGameOver) return;
  var touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}

function handleTouchEnd(event) {
  if (isGameOver) return;
  var touch = event.changedTouches[0];
  var deltaX = touch.clientX - startX;
  var deltaY = touch.clientY - startY;
  var absDeltaX = Math.abs(deltaX);
  var absDeltaY = Math.abs(deltaY);

  if (Math.max(absDeltaX, absDeltaY) > 10) {
    if (absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    }
    renderBoard();
    checkGameOver();
  }
}

// Function to check if the game is over
function checkGameOver() {
  var isEmptyCellAvailable = false;
  var isMergableTileAvailable = false;

  // Check if there are any empty cells on the board
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        isEmptyCellAvailable = true;
        break;
      }
    }
    if (isEmptyCellAvailable) {
      break;
    }
  }

  // Check if there are any adjacent tiles with the same value
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        // Check if the tile to the right has the same value
        if (j < 3 && board[i][j] === board[i][j + 1]) {
          isMergableTileAvailable = true;
          break;
        }
        // Check if the tile below has the same value
        if (i < 3 && board[i][j] === board[i + 1][j]) {
          isMergableTileAvailable = true;
          break;
        }
      }
    }
    if (isMergableTileAvailable) {
      break;
    }
  }

  // Set the game over flag if there are no empty cells or mergable tiles
  isGameOver = !isEmptyCellAvailable && !isMergableTileAvailable;

  // Display alert if the game is over
  if (isGameOver) {
    updateScore(score);
    overGameMSG(score);
  }
  return isGameOver
}

//Function to over game massage
function overGameMSG(score) {
  window.alert(`Loser, Your score is: ${score}`)
}

// Function to handle left movement
function moveLeft() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (board[i][j] !== 0) {
        for (var k = j; k > 0; k--) {
          if (board[i][k - 1] === 0 || board[i][k - 1] === board[i][k]) {
            if (board[i][k - 1] === board[i][k]) {
              // Merge tiles
              board[i][k - 1] *= 2;
              score += board[i][k - 1];
              updateScore(score);
              board[i][k] = 0;
              break;
            } else {
              // Move tile
              board[i][k - 1] = board[i][k];
              board[i][k] = 0;
            }
          }
        }
      }
    }
  }
  generateTile();
}

// Function to handle right movement
function moveRight() {
  for (var i = 0; i < size; i++) {
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] !== 0) {
        for (var k = j; k < size - 1; k++) {
          if (board[i][k + 1] === 0 || board[i][k + 1] === board[i][k]) {
            if (board[i][k + 1] === board[i][k]) {
              // Merge tiles
              board[i][k + 1] *= 2;
              score += board[i][k + 1];
              updateScore(score);
              board[i][k] = 0;
              break
            } else {
              // Move tile
              board[i][k + 1] = board[i][k];
              board[i][k] = 0;
            }
          }
        }
      }
    }
  }
  generateTile();
}

// Function to handle up movement
function moveUp() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (board[i][j] !== 0) {
        for (var k = i; k > 0; k--) {
          if (board[k - 1][j] === 0 || board[k - 1][j] === board[k][j]) {
            if (board[k - 1][j] === board[k][j]) {
              // Merge tiles
              board[k - 1][j] *= 2;
              score += board[k - 1][j];
              updateScore(score);
              board[k][j] = 0;
              break;
            } else {
              // Move tile
              board[k - 1][j] = board[k][j];
              board[k][j] = 0;
            }
          }
        }
      }
    }
  }
  generateTile();
}

// Function to handle down movement
function moveDown() {
  for (var i = 2; i >= 0; i--) {
    for (var j = 0; j < size; j++) {
      if (board[i][j] !== 0) {
        for (var k = i; k < 3; k++) {
          if (board[k + 1][j] === 0 || board[k + 1][j] === board[k][j]) {
            if (board[k + 1][j] === board[k][j]) {
              // Merge tiles
              board[k + 1][j] *= 2;
              score += board[k + 1][j];
              updateScore(score);
              board[k][j] = 0;
              break
            } else {
              // Move tile
              board[k + 1][j] = board[k][j];
              board[k][j] = 0;
            }
          }
        }
      }
    }
  }
  generateTile();
}

// Function to update the score display
bestScoreElement.innerText = localStorage.getItem("bestScore") || 0;
function updateScore(score) {
  scoreElement.textContent = score;
  if (score > +bestScoreElement.textContent) {
    bestScoreElement.textContent = score;
    localStorage.setItem("bestScore", score.toString());
  }
}


// Function to reset the game
function resetGame() {
  board = [];
  score = 0;
  isGameOver = false;
  createBoard();
  generateTile();
  generateTile();
  renderBoard();
  updateScore(score);
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  createBoard();
  generateTile();
  generateTile();
  renderBoard();
});

resetBtn.addEventListener("click", function () {
  resetGame();
});

// Event listeners for touch events
var startX, startY;
gameContainer.addEventListener("touchstart", handleTouchStart, false);
gameContainer.addEventListener("touchend", handleTouchEnd, false);



// Function to handle keydown events
function handleKeyDown(event) {
  if (isGameOver) return;

  switch (event.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    default:
      return;
  }

  renderBoard();
  checkGameOver();
}

// Add event listener for keydown events
document.addEventListener("keydown", handleKeyDown);
