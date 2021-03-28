var white_king_img;
var black_king_img;
var white_pawn;
var black_pawn;
var white_queen;
var black_queen;
var white_rook;
var black_rook;
var white_knight;
var black_knight;
var white_bishop;
var black_bishop;

const columns = 8;
const rows = 8;

const WIDTH = 640;
const HEIGHT = 640;

const w = WIDTH / columns;
const h = HEIGHT / rows;

var grid = new Array(columns);

var options = [];
var current = [];

// team in check
grid.inCheck = null

// initial turn
var turnColour = WHITE;

var stopGame = false;

var canEnPassant = false;

var enPassantCoords;

var computerCol = BLACK

var previousMoves = []




function load() {
  var fen = document.getElementById("fen").value;
  console.log(fen);

  var sections = fen.split("/");

  for (i = 0; i < sections.length; i++) {
    console.log(sections[i]);
    for (j = 0; j < sections[i].length; j++) {
      var colour = WHITE;
      var letters = sections[i].split("");
      var letter = letters[j];
      if (isNumeric(letter)) {
        for (k = j; k < parseInt(letter); k++) { }
      }
      if (isLowerCase(letter)) {
        colour = BLACK;
      }
    }
  }
}
function setup() {
  black_king_img = loadImage("images/black_king.png");
  white_king_img = loadImage("images/white_king.png");
  black_pawn = loadImage("images/black_pawn.png");
  white_pawn = loadImage("images/white_pawn.png");
  black_queen = loadImage("images/black_queen.png");
  white_queen = loadImage("images/white_queen.png");
  black_rook = loadImage("images/black_rook.png");
  white_rook = loadImage("images/white_rook.png");
  black_knight = loadImage("images/black_knight.png");
  white_knight = loadImage("images/white_knight.png");
  black_bishop = loadImage("images/black_bishop.png");
  white_bishop = loadImage("images/white_bishop.png");
  initGrid(grid);
  var cnv = createCanvas(WIDTH, HEIGHT);
}

function draw() {
  background(255, 0, 2);
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (i % 2 !== j % 2) {
        fill("#313B48");
      } else {
        fill("#212934");
      }
      noStroke();

      rect(i * w, j * h, w, h);
      if (grid[i][j] instanceof Piece) {
        grid[i][j].draw(i, j);
      }
    }
  }
  for (var i = 0; i < options.length; i++) {
    fill("#FD6868");
    circle(options[i].endX * w + w / 2, options[i].endY * h + h / 2, w - 60);
  }

  if (turnColour == computerCol && !stopGame) {
    computerTurn();
  }
}

function mouseClicked() {
  if (!stopGame && turnColour == WHITE && 0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT) {
    var pressedX = parseInt((mouseX - (mouseX % w)) / w);
    var pressedY = parseInt((mouseY - (mouseY % h)) / h);

    if (pressedX == current[0] && pressedY == current[1]) {
      // undo select options
      options = [];
      current = [];
      return;
    }

    //MOVES HAVENT BEEN FOUND YET

    if (!isOpen(pressedX, pressedY) && grid[pressedX][pressedY].colorName === turnColour) {
      findMoves(pressedX, pressedY);
    }

    //MOVES HAVE ALREADY BEEN FOUND

    if (options.some((x) => x.endX === pressedX && x.endY === pressedY)) {
      const option = options.find((x) => x.endX === pressedX && x.endY === pressedY);
      MovePiece(current[0], current[1], pressedX, pressedY, grid, option);
    }
  }
}

function computerTurn() {
  randomMove();
  //Search(20, BLACK)
  turnColour = WHITE;
}

function removeArr(arr, element) {
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
}

function Eval() {
  //UndoMove();
  // setGrid(grid);
  console.log("EVAL:", Search(5, WHITE));
}

function randomMove() {
  var blackPieces = [];

  for (i = 0; i < grid.length; i++) {
    for (j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != undefined && grid[i][j].colorName == BLACK) {
        blackPieces.push([i, j]);
      }
    }
  }

  var pieceMovesList = [];

  for (i = 0; i < blackPieces.length; i++) {
    var x = blackPieces[i][0];
    var y = blackPieces[i][1];

    current = [x, y];
    findMoves(x, y);

    if (options.length != 0) {
      pieceMovesList.push([current, options]);
    }
    options = [];
  }

  console.log("MOVELIST:", pieceMovesList);

  if (pieceMovesList.length == 0) {
    //MATE
    if (Mate(col, grid.inCheck)) {
      document.getElementById("check").innerText = `THE COMPUTER was mated ):`;
      stopGame = true;
      return -200;
    }
    //STALEMATE
    else {
      document.getElementById("check").innerText = `STALEMATE ):`;
      stopGame = true;
      return -100;
    }
  }

  var best = findHighest(pieceMovesList);

  var moveInfo;

  var selectedPiece;

  var selectedMove;

  if (best == 0) {
    moveInfo = pieceMovesList[randm(0, pieceMovesList.length - 1)];

    selectedPiece = moveInfo[0];

    selectedMove = moveInfo[1][randm(0, moveInfo[1].length - 1)];
  } else {
    moveInfo = pieceMovesList[best[0]];

    selectedPiece = moveInfo[0];

    selectedMove = moveInfo[1][best[1]];
  }

  options.push(selectedMove);

  var { endX, endY } = selectedMove

  const option = options.find((x) => x.endX === endX && x.endY === endY);

  MovePiece(selectedPiece[0], selectedPiece[1], endX, endY, grid, option);
}

function randm(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
