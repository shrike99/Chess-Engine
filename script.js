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

var turn = 0;

const WIDTH = 640;
const HEIGHT = 640;

const w = WIDTH / columns;
const h = HEIGHT / rows;

var grid = new Array(columns);

grid.options = [];
var current = [];

// team in check
grid.inCheck = null;

// initial turn
var turnColour = WHITE;

var stopGame = false;

var computerCol = BLACK;

var previousMoves = [];

function load() {
	var fen = document.getElementById("fen").value;

	var board = new FENBoard(fen).board;

	console.log(board);

	for (i = 0; i < board.length; i++) {
		for (j = 0; j < grid[i].length; j++) {
			var colour = WHITE;

			var letter = board[i][j];

			if (isLowerCase(letter)) {
				colour = BLACK;
			}
			if (letter.toUpperCase() == "N") {
				grid[j][i] = new Knight(colour);
			}
			if (letter.toUpperCase() == "K") {
				grid[j][i] = new King(colour);
			}
			if (letter.toUpperCase() == "P") {
				grid[j][i] = new Pawn(colour);
			}
			if (letter.toUpperCase() == "Q") {
				grid[j][i] = new Queen(colour);
			}
			if (letter.toUpperCase() == "B") {
				grid[j][i] = new Bishop(colour);
			}
			if (letter.toUpperCase() == "R") {
				grid[j][i] = new Rook(colour);
			}
			if (letter == "") {
				grid[j][i] = null;
			}
		}
	}
}

function setup() {
	black_king_img = loadImage("images/black_king.svg");
	white_king_img = loadImage("images/white_king.svg");
	black_pawn = loadImage("images/black_pawn.svg");
	white_pawn = loadImage("images/white_pawn.svg");
	black_queen = loadImage("images/black_queen.svg");
	white_queen = loadImage("images/white_queen.svg");
	black_rook = loadImage("images/black_rook.svg");
	white_rook = loadImage("images/white_rook.svg");
	black_knight = loadImage("images/black_knight.svg");
	white_knight = loadImage("images/white_knight.svg");
	black_bishop = loadImage("images/black_bishop.svg");
	white_bishop = loadImage("images/white_bishop.svg");
	initGrid(grid);
	var cnv = createCanvas(WIDTH, HEIGHT);
	timerInc.innerText = "+" + increment;
	timerBlack.innerText = formatTime(timeBlack);
	timerWhite.innerText = formatTime(timeWhite);
	whiteTimerStart();
}

function draw() {
	background(255, 0, 2);
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			if (i % 2 !== j % 2) {
				fill("#212934");
			} else {
				fill("#313B48");
			}

			noStroke();

			if (!isOpen(i, j) && grid.inCheck == grid[i][j].colorName && grid[i][j].type == "King") {
				stroke("#FD4D4D");
				strokeWeight(3);
			}

			rect(i * w, j * h, w, h);
			if (grid[i][j] instanceof Piece) {
				grid[i][j].draw(i, j);
			}
		}
	}
	for (var i = 0; i < grid.options.length; i++) {
		fill("#FD6868");
		circle(grid.options[i].endX * w + w / 2, grid.options[i].endY * h + h / 2, w - 60);
	}

	if (turnColour == computerCol && !stopGame) {
		computerTurn();
	}
}

// var arrowStartX;
// var arrowStartY;

// function mousePressed() {
// 	if (!stopGame && 0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT && mouseButton == RIGHT) {
// 		if (arrowStartX == undefined && arrowStartY == undefined) {
// 			arrowStartX = mouseX;
// 			arrowStartY = mouseY;
// 		} else {
// 			var val1 = arrowStartX;
// 			var val2 = arrowStartY;
// 			var v0 = createVector(val1, val2);
// 			var v1 = createVector(mouseX, mouseY);
// 			drawArrow(v0, v1, "black");

// 			arrowStartX = undefined;
// 			arrowStartY = undefined;
// 		}
// 	}
// }

function mouseClicked() {
	// && turnColour == WHITE
	if (!stopGame && 0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT) {
		var pressedX = parseInt((mouseX - (mouseX % w)) / w);
		var pressedY = parseInt((mouseY - (mouseY % h)) / h);

		if (pressedX == current[0] && pressedY == current[1]) {
			// undo select options
			grid.options = [];
			current = [];
			return;
		}

		//MOVES HAVENT BEEN FOUND YET

		if (!isOpen(pressedX, pressedY) && grid[pressedX][pressedY].colorName === turnColour) {
			findMoves(pressedX, pressedY);
		}

		//MOVES HAVE ALREADY BEEN FOUND

		if (grid.options.some((x) => x.endX === pressedX && x.endY === pressedY)) {
			const option = grid.options.find((x) => x.endX === pressedX && x.endY === pressedY);
			MovePiece(current[0], current[1], pressedX, pressedY, grid, option);
		}
	}
}

// const delay = ms => new Promise(res => setTimeout(res, ms))

function computerTurn() {
	randomMove();
	var searched = Search(2, turnColour);
	console.log("❔ - computerTurn - searched", searched);

	// var move = searched[1];

	// MovePiece(move.initX, move.initY, move.endX, move.endY, grid, move);
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
	Search(1, BLACK);
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
		findMoves(x, y, grid);

		if (grid.options.length != 0) {
			pieceMovesList.push([current, grid.options]);
		}
		grid.options = [];
	}

	//console.log("MOVELIST:", pieceMovesList);

	if (pieceMovesList.length == 0) {
		//MATE
		if (Mate(computerCol, grid.inCheck, grid)) {
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

	grid.options.push(selectedMove);

	var { endX, endY } = selectedMove;

	const option = grid.options.find((x) => x.endX === endX && x.endY === endY);

	MovePiece(selectedPiece[0], selectedPiece[1], endX, endY, grid, option);
}

function randm(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
