/*---- constants ----*/
const COLORS = {
  red: 1,
  green: 2,
  blue: 3,
  yellow: 4,
  orange: 5,
  slateblue: 6,
};
const DEFAULTTURN = -1;

/*---- state variables ----*/
let turn, turnCount, board, winner, updateId, player;

/*---- cached elements ----*/
const playButtons = document.querySelector("#gameplay>.positions");
const gamePlay = document.querySelector("#gameplay");
const gamePlayHeader = document.querySelector("#gameplay-header");
const controlButton = document.querySelector("#control-button");
const alert = document.querySelector("#alert");
const turnMessage = document.querySelector("#turn");
const colorSelector = document.querySelector("#colors");
const playerInput = document.querySelector("#player-input");
const playerButtons = document.querySelector("#players");
const updateMessage = document.querySelector("#instruction");

/*---- functions ----*/
const gameOver = () => {
  if (winner > 0) {
    controlButton.innerText = "Play Again";
    return true;
  }
  return false;
};

const createAlert = (msg, position) => {
  if (position == "turn") {
    msg == "reset"
      ? (turnMessage.innerHTML = "&nbsp; ")
      : (turnMessage.innerHTML = msg);
  } else if (position == "update") {
    msg == "reset"
      ? (updateMessage.innerHTML = "&nbsp; ")
      : (updateMessage.innerHTML = msg);
  } else {
    msg == "reset" ? (alert.innerHTML = "&nbsp; ") : (alert.innerHTML = msg);
  }
};

const switchTurns = () => {
  if (gameOver()) return;
  if (player[1].color == player[2].color) {
    createAlert(`Both players can't have the same color. Let's reset.`);
    init();
    return;
  }
  if (turn == player[1].color) {
    turn = player[2].color;
    player[2].name != ""
      ? createAlert(`${player[2].name}'s turn`, `turn`)
      : createAlert(`Player 2's turn`, `turn`);
  } else if (turn == player[2].color) {
    turn = player[1].color;
    player[1].name != ""
      ? createAlert(`${player[1].name}'s turn`, `turn`)
      : createAlert(`Player 1's turn`, `turn`);
  }
};

const playPosition = (row, column) => {
  board[row][column] = turn;
  document.getElementById(
    `r${row}c${column}`
  ).style.backgroundColor = `var(--${turn})`;
  checkPosition(row, column);
};

const playTurn = (col) => {
  if (gameOver()) return;
  if (board[board.length - 1][col] > 0) return;
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][col] == 0 && i == 0) {
      playPosition(i, col);
      break;
    } else if (board[i][col] > 0) {
      playPosition(i + 1, col);
      break;
    }
  }
};

const horizontalCheckRight = (row, column) => {
  if (column + 4 > board[0].length) return 0;
  let count = 0,
    result = [];
  for (let i = column; i < board[row].length; i++) {
    if (i < 0) return 0;
    if (column + 4 > 6) break;
    if (board[row][i] == turn) {
      count++;
    } else if (board[row][i] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "right");
      return result;
      break;
    }
  }
  return 0;
};

const horizontalCheckLeft = (row, column) => {
  if (column - 4 < -1) return 0;
  (count = 0), (result = []);
  for (let i = column; i >= column - 4; i--) {
    if (i < 0) return 0;
    if (board[row][i] == turn) {
      count++;
    } else if ([row][i] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "left");
      return result;
      break;
    }
  }
  return 0;
};

const verticalCheck = (row, column) => {
  (count = 0), (result = []);
  for (let i = row; i < board.length; i++) {
    if (board[i][column] == turn) {
      count++;
    } else if (board[i][column] == 0) {
      break;
    }
    if (count > 3) {
      result.push(true, "north");
      return result;
      break;
    }
  }
  count = 0;
  if (row - 3 < 0) return 0;
  for (let i = row; i >= row - 4; i--) {
    if (i < 0) return 0;
    if (board[i][column] == turn) {
      count++;
    } else if (board[i][column] == 0) {
      break;
    } else {
      continue;
    }
    if (count == 4) {
      result.push(true, "south");
      return result;
      break;
    }
  }
  return 0;
};

const diagonalNECheck = (row, column) => {
  if (row + 4 > 5) return 0;
  if (column + 4 > 6) return 0;
  let posState = board[row][column],
    count = 0,
    result = [],
    rI = row,
    cI = column;
  for (let i = 0; i <= 4; i++) {
    if (board[rI][cI] == turn) {
      count++;
      rI++;
      cI++;
    } else if (board[rI][cI] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "northeast");
      return result;
      break;
    }
  }
  return 0;
};

const diagonalNWCheck = (row, column) => {
  if (row + 4 > 5) return 0;
  if (column - 4 < -1) return 0;
  let posState = board[row][column],
    count = 0,
    result = [],
    rI = row,
    cI = column;
  for (let i = 0; i <= 4; i++) {
    if (board[rI][cI] == turn) {
      count++;
      rI++;
      cI--;
    } else if (board[rI][cI] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "northwest");
      return result;
      break;
    }
  }
  return 0;
};

const diagonalSWCheck = (row, column) => {
  if (row - 4 < -1) return 0;
  if (column - 4 < -1) return 0;
  let posState = board[row][column],
    count = 0,
    result = [],
    rI = row,
    cI = column;
  for (let i = 0; i <= 4; i++) {
    if (board[rI][cI] == turn) {
      count++;
      rI--;
      cI--;
    } else if (board[rI][cI] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "southwest");
      return result;
      break;
    }
  }
  return 0;
};

const diagonalSECheck = (row, column) => {
  if (row - 4 < -1) return 0;
  if (column + 4 > 6) return 0;
  let count = 0,
    result = [],
    rI = row,
    cI = column;
  for (let i = 0; i <= 4; i++) {
    if (i < 0) return 0;
    if (rI < 0) break;
    if (board[rI][cI] == turn) {
      count++;
      rI--;
      cI++;
    } else if (board[rI][cI] == 0) {
      break;
    }
    if (count == 4) {
      result.push(true, "southeast");
      return result;
      break;
    }
  }
  return 0;
};

const checkPosition = (row, column) => {
  let playerName = player[1].color == turn ? player[1].name : player[2].name;
  if (diagonalSECheck(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return diagonalSECheck(row, column);
  } else if (diagonalSWCheck(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return diagonalSWCheck(row, column);
  } else if (diagonalNECheck(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return diagonalNECheck(row, column);
  } else if (diagonalNWCheck(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return diagonalNWCheck(row, column);
  } else if (horizontalCheckLeft(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return horizontalCheckLeft(row, column);
  } else if (horizontalCheckRight(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return horizontalCheckRight(row, column);
  } else if (verticalCheck(row, column) != 0) {
    createAlert(`${playerName} wins after ${turnCount} rounds.`);
    winner = turn;
    return verticalCheck(row, column);
  } else {
    return 0;
  }
};

const renderBoard = () => {
  let gameBoard = "";
  for (let i = board.length - 1; i >= 0; i--) {
    for (let j = 0; j < board[i].length; j++) {
      let boardPosition = document.createElement("div");
      boardPosition.classList.add("position");
      boardPosition.id = `r${i}c${j}`;
      boardPosition.dataset.row = i;
      boardPosition.dataset.column = j;
      gamePlay.appendChild(boardPosition);
    }
  }
  for (let i = 0; i < board[0].length; i++) {
    let playButton = document.createElement("div");
    playButton.classList.add("play-column");
    playButton.id = `c${i}`;
    playButton.dataset.column = i;
    gamePlayHeader.appendChild(playButton);
  }
};

const updatePlayer = (id, prop, value) => {
  if (prop == "name") {
    player[id].name = value;
  } else if (prop == "color") {
    player[id].color = value;
  }
  return 0;
};

const renderControls = () => {
  colorSelector.innerHTML = "";
  for (let item in COLORS) {
    let colorButton = document.createElement("div");
    colorButton.id = `color-${COLORS[item]}`;
    colorButton.classList.add("color-button");
    colorButton.dataset.color = `${COLORS[item]}`;
    colorButton.style.backgroundColor = `var(--${COLORS[item]})`;
    colorSelector.appendChild(colorButton);
  }
  for (let item in player) {
    let playerUpdateButton = document.createElement("div");
    playerUpdateButton.id = `player-${item}`;
    playerUpdateButton.classList.add(`player`);
    playerUpdateButton.innerText = `Player ${item}`;
    playerButtons.appendChild(playerUpdateButton);
  }
  document.querySelector(`#player-${updateId}`).classList.add("active");
};

const render = () => {
  renderControls();
  renderBoard();
};

const resetBoard = () => {
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  player = {
    1: { name: "", color: -1 },
    2: { name: "", color: -1 },
  };
  (turn = DEFAULTTURN), (winner = DEFAULTTURN), (turnCount = 0), (updateId = 1);
  gamePlay.innerHTML = "";
  gamePlayHeader.innerHTML = "";
  playerButtons.innerHTML = "";
  controlButton.innerHTML = `Create Player ${updateId}`;
  createAlert("reset");
  createAlert("reset", "turn");
  createAlert(`Player ${updateId}, choose a name and color`, "update");
  document.querySelector("#player-update").style.display = "";
};

const handleDrop = (e) => {
  if (turn == -1) return;
  if (e.target.classList.contains("play-column")) {
    turnCount++;
    playTurn(e.target.dataset.column);
    switchTurns();
  }
};

const playerId = (colorId) => {
  for (let i=1;i<=2;i++) {
    if (player[i].name == "") player[i].name = `Player ${i}`
    if (player[i].color == colorId) return i
  }
  return false
}

const optionSelect = (e) => {
  createAlert("reset", "update");
  if (e.target.innerText == "Game in Progress") {
    let currentPlayer = playerId(turn)
    createAlert(`${player[currentPlayer].name}'s turn`, "turn");
    if (turnCount == 0) {
    player[currentPlayer].name
      ? createAlert(`${player[currentPlayer].name}, make your first drop`)
      : createAlert(`Make your first drop`);
    } else {
      player[currentPlayer].name
      ? createAlert(`${player[currentPlayer].name}, make the next drop. Turn ${turnCount}.`)
      : createAlert(`Make the next drop - Turn ${turnCount}.`);
    }
  }
  if (
    e.target.innerText == "Create Player 1" ||
    e.target.innerText == "Create Player 2"
  ) {
    document.querySelectorAll(".color-button").forEach((item) => {
      if (item.classList.contains("active")) {
        player[updateId].color = item.dataset.color;
        item.style.display = "none";
      }
    });
    player[updateId].name = playerInput.value;
    playerInput.value = "";
    if (updateId == 1) {
      updateId++;
      controlButton.innerHTML = `Create Player ${updateId}`;
      document.querySelectorAll(".player").forEach((item) => {
        item.classList.remove("active");
      });
      document.querySelector(`#player-${updateId}`).classList.add("active");
      createAlert(`Player ${updateId}, choose a name and color`, "update");
    }
  } else if (e.target.innerText == "Play Again") {
    init();
  }
  if (player[1].color > -1 && player[2].color > -1 && turnCount == 0) {
    e.target.innerText = "Game in Progress";
    document.querySelector("#player-update").style.display = "none";
    turn = player[1].color;
  }
  if (turn > 0) createAlert(`${player[playerId(turn)].name}'s turn`, "turn");
};

const playerSelect = (e) => {
  if (e.target.innerText == "Player 1") {
    document.querySelector("#player-2").classList.remove("active");
    document.querySelector("#player-1").classList.add("active");
    updateId = 1;
  } else {
    document.querySelector("#player-1").classList.remove("active");
    document.querySelector("#player-2").classList.add("active");
    updateId = 2;
  }
  controlButton.innerHTML = `Create Player ${updateId}`;
};

const colorSelect = (e) => {
  if (e.target.id == "colors") return;
  document.querySelectorAll(".color-button").forEach((item) => {
    item.classList.remove("active");
  });
  e.target.classList.add("active");
};

const rollOverTransition = (e) => {
  if (
    e.target.classList.contains("play-column") &&
    !e.target.classList.contains("active-drop") &&
    turn > 0
  ) {
    e.target.style.backgroundColor = `var(--${turn})`;
    e.target.classList.add("active-drop");
  } else if (
    e.target.classList.contains("play-column") &&
    e.target.classList.contains("active-drop") &&
    turn > 0
  ) {
    e.target.style.backgroundColor = `var(--default)`;
    e.target.classList.remove("active-drop");
  }
};

const init = () => {
  resetBoard();
  render();
};

init();

/*---- event listeners ----*/

gamePlayHeader.addEventListener("click", handleDrop);
controlButton.addEventListener("click", optionSelect);
playerButtons.addEventListener("click", playerSelect);
colorSelector.addEventListener("click", colorSelect);
gamePlayHeader.addEventListener("mouseover", rollOverTransition);
gamePlayHeader.addEventListener("mouseout", rollOverTransition);
