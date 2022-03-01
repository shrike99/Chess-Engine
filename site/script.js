let a = '';

// TODO: CHECK WHETHER IT IS BLACK TURN AND IF CASTLING IS AVAILABLE
function load() {
	let fen = document.getElementById('fen').value;

	let board = new FENBoard(fen).board;

	console.log(board);

	for (i = 0; i < board.length; i++) {
		for (j = 0; j < grid[i].length; j++) {
			let colour = WHITE;

			let letter = board[i][j];

			if (isLowerCase(letter)) {
				colour = BLACK;
			}
			if (letter.toUpperCase() === 'N') {
				grid[j][i] = new Knight(colour);
			}
			if (letter.toUpperCase() === 'K') {
				grid[j][i] = new King(colour);
			}
			if (letter.toUpperCase() === 'P') {
				grid[j][i] = new Pawn(colour);
			}
			if (letter.toUpperCase() === 'Q') {
				grid[j][i] = new Queen(colour);
			}
			if (letter.toUpperCase() === 'B') {
				grid[j][i] = new Bishop(colour);
			}
			if (letter.toUpperCase() === 'R') {
				grid[j][i] = new Rook(colour);
			}
			if (letter === '') {
				grid[j][i] = null;
			}
		}
	}
}

function draw() {
	background(255, 0, 2);
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (i % 2 !== j % 2) {
				fill('#212934');
			} else {
				fill('#313B48');
			}

			noStroke();

			if (!isEmpty(i, j) && grid.inCheck === grid[i][j].colorName && grid[i][j].type === 'King') {
				stroke('#FD4D4D');
				strokeWeight(3);
			}

			rect(i * w, j * h, w, h);
			if (grid[i][j] instanceof Piece) {
				grid[i][j].draw(i, j);
			}
		}
	}
	for (let i = 0; i < grid.options.length; i++) {
		fill('#FD6868');
		circle(grid.options[i].endX * w + w / 2, grid.options[i].endY * h + h / 2, w - 60);
	}

	if (togglebot.textContent === 'BOT: ON' && turnColour === computerCol && !stopGame) {
		computerTurn();
	}
}

function ToggleBot() {
	if (togglebot.textContent === 'BOT: OFF') {
		togglebot.textContent = 'BOT: ON';
	} else {
		togglebot.textContent = 'BOT: OFF';
	}
}

// let arrowStartX;
// let arrowStartY;

// function mousePressed() {
// 	if (!stopGame && 0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT && mouseButton === RIGHT) {
// 		if (arrowStartX === undefined && arrowStartY === undefined) {
// 			arrowStartX = mouseX;
// 			arrowStartY = mouseY;
// 		} else {
// 			let val1 = arrowStartX;
// 			let val2 = arrowStartY;
// 			let v0 = createVector(val1, val2);
// 			let v1 = createVector(mouseX, mouseY);
// 			drawArrow(v0, v1, "black");

// 			arrowStartX = undefined;
// 			arrowStartY = undefined;
// 		}
// 	}
// }

function mouseClicked() {
	// && turnColour === WHITE
	if (!stopGame && 0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT) {
		let pressedX = parseInt((mouseX - (mouseX % w)) / w);
		let pressedY = parseInt((mouseY - (mouseY % h)) / h);

		if (pressedX === current[0] && pressedY === current[1]) {
			// undo select options
			grid.options = [];
			current = [];
			return;
		}

		//MOVES HAVENT BEEN FOUND YET

		if (!isEmpty(pressedX, pressedY) && grid[pressedX][pressedY].colorName === turnColour) {
			findMoves(pressedX, pressedY);
		}

		//MOVES HAVE ALREADY BEEN FOUND

		if (grid.options.some((x) => x.endX === pressedX && x.endY === pressedY)) {
			const option = grid.options.find((x) => x.endX === pressedX && x.endY === pressedY);
			MovePiece(current[0], current[1], pressedX, pressedY, grid, option);
		}
	}
}

function updateDepth() {
	depthValue = +document.getElementById('depthInput').value;
}

// const delay = ms => new Promise(res => setTimeout(res, ms))

function computerTurn() {
	//let searched = Search(depthValue, BLACK);
	randomMove();

	//console.log('❔ WENT THROUGH:', gonethrough);
	//console.log('❔ TOOK:', searched[2]);
	//console.log('❔ BEST:', searched);

	gonethrough = 0;

	//let move = searched[1];

	//MovePiece(move.initX, move.initY, move.endX, move.endY, grid, move);
	turnColour = WHITE;
}

function removeArr(arr, element) {
	for (i = arr.length - 1; i >= 0; i--) {
		if (arr[i] === element) {
			arr.splice(i, 1);
		}
	}
}

function EvalClick() {
	console.log('1:', test(1, x));
	console.log('2:', test(2, x));
	console.log('3:', test(3, x));
	console.log('4:', test(4, x));
}

function randomMove() {
	let blackPieces = [];

	for (i = 0; i < grid.length; i++) {
		for (j = 0; j < grid[i].length; j++) {
			if (grid[i][j] != undefined && grid[i][j].colorName === BLACK) {
				blackPieces.push([i, j]);
			}
		}
	}

	let pieceMovesList = [];

	for (i = 0; i < blackPieces.length; i++) {
		let x = blackPieces[i][0];
		let y = blackPieces[i][1];

		current = [x, y];
		findMoves(x, y, grid);

		if (grid.options.length != 0) {
			pieceMovesList.push([current, grid.options]);
		}
		grid.options = [];
	}

	//console.log("MOVELIST:", pieceMovesList);

	if (pieceMovesList.length === 0) {
		//MATE
		if (Mate(computerCol, grid.inCheck, grid)) {
			document.getElementById('check').innerText = `THE COMPUTER was mated ):`;
			stopGame = true;
			return -200;
		}
		//STALEMATE
		else {
			document.getElementById('check').innerText = `STALEMATE ):`;
			stopGame = true;
			return -100;
		}
	}

	let best = findHighest(pieceMovesList);

	let moveInfo;

	let selectedPiece;

	let selectedMove;

	if (best === 0) {
		moveInfo = pieceMovesList[randm(0, pieceMovesList.length - 1)];

		selectedPiece = moveInfo[0];

		selectedMove = moveInfo[1][randm(0, moveInfo[1].length - 1)];
	} else {
		moveInfo = pieceMovesList[best[0]];

		selectedPiece = moveInfo[0];

		selectedMove = moveInfo[1][best[1]];
	}

	grid.options.push(selectedMove);

	let { endX, endY } = selectedMove;

	const option = grid.options.find((x) => x.endX === endX && x.endY === endY);

	MovePiece(selectedPiece[0], selectedPiece[1], endX, endY, grid, option);
}

function randm(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
