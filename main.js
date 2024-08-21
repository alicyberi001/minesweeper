import "./style.css";
const body = document.getElementById("body");
const container = document.getElementById("container");
let boardElem = document.createElement("div");
let rowInput = document.getElementById("rowInput").value;
let colInput = document.getElementById("colInput").value;
let rowInp = document.getElementById("rowInput");
let colInp = document.getElementById("colInput");
let bombInput = document.getElementById("bombInput").value;
let bombInp = document.getElementById("bombInput");
let startBtn = document.getElementById("startBtn");
let board = [];
let bombs = [];
let is_open_cell = [];
let game_board = [];
let cell;
let errorName;
let errorArr = [];
let freeze = false;
let flag = "start";

function init(rowInput, colInput) {
  for (let i = 0; i < rowInput; i++) {
    let row1 = [];
    let row2 = [];
    for (let j = 0; j < colInput; j++) {
      row1.push(false);
      row2.push(false);
    }
    bombs.push(row1);
    is_open_cell.push(row2);
  }

  for (let i = 0; i < rowInput; i++) {
    let column = [];
    for (let j = 0; j < colInput; j++) {
      column.push(0);
    }
    game_board.push(column);
  }
}

function generate_bombs(bombs, bombInput, is_open_cell) {
  for (let i = 0; i < bombInput; i++) {
    let row = parseInt(Math.random() * bombs.length);
    let column = parseInt(Math.random() * bombs[0].length);

    if (bombs[row][column] == true) {
      i--;
      continue;
    }
    bombs[row][column] = true;
  }
}

function bombs_around_cell(game_board, bombs) {
  for (let i = 0; i < game_board.length; i++) {
    for (let j = 0; j < game_board[0].length; j++) {
      if (bombs[i][j] == true) {
        increase_one(game_board, i - 1, j - 1);
        increase_one(game_board, i - 1, j);
        increase_one(game_board, i - 1, j + 1);
        increase_one(game_board, i, j - 1);
        increase_one(game_board, i, j + 1);
        increase_one(game_board, i + 1, j - 1);
        increase_one(game_board, i + 1, j);
        increase_one(game_board, i + 1, j + 1);
      }
    }
  }
}

function increase_one(game_board, i, j) {
  if (i >= 0 && j >= 0 && i < game_board.length && j < game_board[0].length) {
    game_board[i][j]++;
  }
}

function open_cell(game_board, bombs, is_open_cell, i, j) {
  if (
    !(i >= 0 && j >= 0 && i < game_board.length && j < game_board[0].length) ||
    is_open_cell[i][j]
  ) {
    return true;
  }
  is_open_cell[i][j] = true;
  if (bombs[i][j]) {
    return false; // game over (bomb clicked!)
  }
  if (game_board[i][j] > 0) {
    board[i][j].innerText = game_board[i][j];
    board[i][j].style.backgroundColor = "#075985";
    return true; // true choice
  }
  board[i][j].style.backgroundColor = "#075985";
  board[i][j].innerText = 0;
  open_cell(game_board, bombs, is_open_cell, i - 1, j - 1);
  open_cell(game_board, bombs, is_open_cell, i - 1, j);
  open_cell(game_board, bombs, is_open_cell, i - 1, j + 1);
  open_cell(game_board, bombs, is_open_cell, i, j - 1);
  open_cell(game_board, bombs, is_open_cell, i, j + 1);
  open_cell(game_board, bombs, is_open_cell, i + 1, j - 1);
  open_cell(game_board, bombs, is_open_cell, i + 1, j);
  open_cell(game_board, bombs, is_open_cell, i + 1, j + 1);
  return true;
}

function end_check(is_open_cell, bombs) {
  for (let i = 0; i < is_open_cell.length; i++) {
    for (let j = 0; j < is_open_cell.length; j++) {
      if (is_open_cell[i][j] == false && bombs[i][j] == false) {
        return false;
      }
    }
  }
  return true;
}

function cellGenerator(rowInput, colInput) {
  container.appendChild(boardElem);
  for (let i = 0; i < rowInput; i++) {
    let row = [];
    for (let j = 0; j < colInput; j++) {
      cell = document.createElement("div");
      cell.dataset.x = `${i}`;
      cell.dataset.y = `${j}`;
      cell.className =
        "w-8 h-8 bg-cyan-600 hover:bg-blue-700 cursor-pointer flex justify-center items-center shadow-inner font-bold rounded-md";
      cell.addEventListener("click", cellClick);
      boardElem.append(cell);
      row.push(cell);
    }
    board.push(row);
  }
  boardElem.style.display = "grid";
  boardElem.style.gap = "4px";
  boardElem.style.backgroundColor = "#082F49";
  boardElem.style.gridTemplateColumns = `repeat(${colInput}, 30px)`;
  boardElem.style.gridTemplateRows = `repeat(${rowInput}, 30px)`;
}

function cellClick() {
  console.log(this);
  let xpos = Number(this.dataset.x);
  let ypos = Number(this.dataset.y);
  console.log(xpos, ypos);
  if (!freeze) {
    if (!open_cell(game_board, bombs, is_open_cell, xpos, ypos)) {
      //   this.style.backgroundColor = "#fbff00";
      this.classList.add("bg-red-200");
      is_open_cell[xpos][ypos] == true;
      showMines();
      freeze = true;
    } else if (game_board[xpos][ypos] > 0) {
      board[xpos][ypos].innerText = game_board[xpos][ypos];
      board[xpos][ypos].style.backgroundColor = "#075985";
      if (end_check(is_open_cell, bombs)) {
        freeze = true;
        clearInterval(interval);
        alert(
          `Congratulations, you won in ${
            document.getElementById("minutes").textContent
          }:${document.getElementById("seconds").textContent}😍`
        );
      }
    } else if (game_board[xpos][ypos] == 0) {
      open_cell(game_board, bombs, is_open_cell, xpos, ypos);
    }
  }
}

function showMines() {
  clearInterval(interval);
  for (let i = 0; i < rowInput; i++) {
    for (let j = 0; j < colInput; j++) {
      let square = board[i][j];
      if (bombs[i][j]) {
        square.innerText = "💣";
        square.classList.add("bg-red-500");
        // square.style.backgroundColor = "red";
        // console.log(game_board)
      }
    }
  }
}

function change_color(game_board, board) {
  for (let i = 0; i < game_board.length; i++) {
    for (let j = 0; j < game_board[0].length; j++) {
      if (game_board[i][j] == 0) {
        // board[i][j].classList.add("text-yellow-200");
      }
      if (game_board[i][j] == 1) {
        board[i][j].classList.add("text-red-100");
      }
      if (game_board[i][j] == 2) {
        board[i][j].classList.add("text-red-400");
      }
      if (game_board[i][j] == 3) {
        board[i][j].classList.add("text-red-700");
      }
      if (game_board[i][j] == 4) {
        board[i][j].classList.add("text-red-950");
      }
      if (game_board[i][j] == 5) {
        board[i][j].classList.add("text-red-950");
      }
      if (game_board[i][j] == 6) {
        board[i][j].classList.add("text-red-950");
      }
      if (game_board[i][j] == 7) {
        board[i][j].classList.add("text-red-950");
      }
      if (game_board[i][j] == 8) {
        board[i][j].classList.add("text-red-950");
      }
    }
  }
}

function start_game() {
  console.log(isNaN(val1));
  rowInput = parseInt(document.getElementById("rowInput").value);
  colInput = parseInt(document.getElementById("colInput").value);
  bombInput = parseInt(document.getElementById("bombInput").value);
  if (
    !val1 ||
    !val2 ||
    !val3 ||
    isNaN(rowInput) ||
    isNaN(colInput) ||
    isNaN(bombInput)
  ) {
    alert(`invalid input`);
  }
  // if (rowInput == '') {
  //   rowInput = 10
  // }
  else if (flag === "start") {
    init(rowInput, colInput);
    generate_bombs(bombs, bombInput, is_open_cell);
    bombs_around_cell(game_board, bombs);
    cellGenerator(rowInput, colInput);
    change_color(game_board, board);
    timer();
    startBtn.classList.add("bg-red-400");
    startBtn.innerText = "restart";
    flag = "restart";
  } else {
    timer();
    startBtn.classList.remove("bg-red-400");
    startBtn.innerText = "start";
    boardElem.innerHTML = "";
    container.removeChild(boardElem);
    board = [];
    bombs = [];
    is_open_cell = [];
    game_board = [];
    flag = "start";
    freeze = false;
  }
}

let val1 = true;
let val2 = true;
let val3 = true;

function row_validation() {
  rowInput = parseInt(document.getElementById("rowInput").value);
  if (isNaN(this.value)) {
    console.log(this.value);
    this.style.backgroundColor = "#E46086";
    val1 = false;
    if (!errorArr.includes(`${this.id}`)) {
      errorArr.push(this.id);
    }
  }
  if (!isNaN(this.value)) {
    if ((this.style.backgroundColor = "#E46086")) {
      this.style.backgroundColor = "";
      if (errorArr.includes(`${this.id}`)) {
        let pos = errorArr.findIndex((index) => index == this.id);
        errorArr.splice(pos, 1);
        val1 = true;
      }
    }
  }
}

function col_validation() {
  colInput = parseInt(document.getElementById("colInput").value);
  if (isNaN(this.value)) {
    this.style.backgroundColor = "#E46086";
    val2 = false;
    errorArr.push(this.id);
  }
  if (!isNaN(this.value)) {
    if ((this.style.backgroundColor = "#E46086")) {
      this.style.backgroundColor = "";
      if (errorArr.includes(`${this.id}`)) {
        let pos = errorArr.findIndex((index) => index == this.id);
        errorArr.splice(pos, 1);
        val2 = true;
      }
    }
  }
}

function bomb_validation() {
  rowInput = parseInt(document.getElementById("rowInput").value);
  colInput = parseInt(document.getElementById("colInput").value);
  bombInput = parseInt(document.getElementById("bombInput").value);
  if (isNaN(this.value) || bombInput > rowInput * colInput || bombInput < 1) {
    this.style.backgroundColor = "#E46086";
    val3 = false;
    errorArr.push(this.id);
  } else if (!isNaN(this.value)) {
    if ((this.style.backgroundColor = "#E46086")) {
      this.style.backgroundColor = "";
      if (errorArr.includes(`${this.id}`)) {
        let pos = errorArr.findIndex((index) => index == this.id);
        errorArr.splice(pos, 1);
        val3 = true;
      }
    }
  }
}

startBtn.addEventListener("click", start_game);
rowInp.addEventListener("keydown", row_validation);
colInp.addEventListener("keypress", col_validation);
bombInp.addEventListener("keydown", bomb_validation);

let totalSeconds = 0;
let interval;

function updateTimer() {
  totalSeconds++;

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

function timer() {
  if (!interval) {
    interval = setInterval(updateTimer, 1000);
    console.log(interval);
  } else {
    clearInterval(interval);
    totalSeconds = 0;
    interval = false;
    console.log(interval);
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
  }
}
