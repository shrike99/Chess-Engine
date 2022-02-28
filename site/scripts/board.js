function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let zobristArr = new Array(8);
for (let i = 0; i < 8; i++) {
	zobristArr[i] = new Array(8);
	for (let j = 0; j < 8; j++) {
		zobristArr[i][j] = new Array(2);
		for (let k = 0; k < 2; k++) {
			zobristArr[i][j][k] = getRandomInt(0, 2147483647);
		}
	}
}

class Board {
	constructor(board, main = false) {
		const columns = 8;

		this.grid = new Array(columns);
		this.mainBoard = main;

		if (board) this.loadFromBoard(board);
		else this.loadInit();
	}

	getZobrist() {
		let h = 0;
		//https://www.chessprogramming.org/Zobrist_Hashing
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (!isEmpty(i, j, this.grid)) {
					let col = this.grid[i][j].colorName === WHITE ? 0 : 1;
					h ^= zobristArr[i][j][col];
				}
			}
		}
		return h;
	}

	loadFromBoard(copy) {
		for (let i = 0; i < copy.length; i++) {
			this.grid[i] = new Array(rows);
			for (let j = 0; j < copy[i].length; j++) {
				if (!isEmpty(i, j, copy)) {
					this.grid[i][j] = new copy[i][j].constructor(copy[i][j].colorName);
				}
			}
		}
	}

	loadInit() {
		const rows = 8,
			columns = 8;

		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i] = new Array(rows);
			for (let j = 0; j < this.grid[i].length; j++) {
				if (j === 1) {
					this.grid[i][j] = new Pawn(BLACK);
				} else if (j === rows - 2) {
					this.grid[i][j] = new Pawn(WHITE);
				} else if (i === 0 || i === columns - 1) {
					if (j === 0) {
						this.grid[i][j] = new Rook(BLACK);
					} else if (j === rows - 1) {
						this.grid[i][j] = new Rook(WHITE);
					}
				} else if (i === 1 || i === columns - 2) {
					if (j === 0) {
						this.grid[i][j] = new Knight(BLACK);
					} else if (j === rows - 1) {
						this.grid[i][j] = new Knight(WHITE);
					}
				} else if (i === 2 || i === columns - 3) {
					if (j === 0) {
						this.grid[i][j] = new Bishop(BLACK);
					} else if (j === rows - 1) {
						this.grid[i][j] = new Bishop(WHITE);
					}
				} else if (i === 3) {
					if (j === 0) {
						this.grid[i][j] = new Queen(BLACK);
					} else if (j === rows - 1) {
						this.grid[i][j] = new Queen(WHITE);
					}
				} else if (i === 4) {
					if (j === 0) {
						this.grid[i][j] = new King(BLACK);
					} else if (j === rows - 1) {
						this.grid[i][j] = new King(WHITE);
					}
				}
			}
		}
	}

	getMoves(col) {
		let pieces = [],
			pieceMovesList = [];

		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (!isEmpty(i, j, this.grid) && this.grid[i][j].colorName === col) pieces.push([i, j]);
			}
		}

		for (let i = 0; i < pieces.length; i++) {
			let x = pieces[i][0],
				y = pieces[i][1],
				current = [x, y];

			findMoves(x, y, this.grid);

			if (this.grid.options.length !== 0) {
				pieceMovesList.push([current, this.grid.options, this.grid[x][y]]);
			}
			this.grid.options = [];
		}

		return pieceMovesList;
	}

	EvaluatePosition(col) {
		const black = getBlack(this.grid),
			white = getWhite(this.grid),
			blackScore = getScore(black),
			whiteScore = getScore(white);

		return col === WHITE ? whiteScore - blackScore : blackScore - whiteScore;
	}

	MovePiece(currX, currY, pressedX, pressedY, option, col) {
		let pieceinoption = this.grid[pressedX][pressedY],
			end = this.grid[currX][currY].colorName === WHITE ? 0 : rows - 1;

		if (pressedY === end && this.grid[currX][currY].type === 'Pawn') {
			handlePromotion(currX, currY);
		}
		this.grid[currX][currY].moved = true;

		//const option = options.find((x) => x.endX === pressedX && x.endY === pressedY);

		this.grid[pressedX][pressedY] = this.grid[currX][currY];
		this.grid[currX][currY] = null;

		const enpassantRow = this.grid[pressedX][pressedY].colorName === WHITE ? 3 : 4;

		if (option.extra === DOUBLE) {
			this.grid[pressedX][pressedY].turn = turn;
		}

		if (option.extra === ENPASSANT && this.grid[pressedX][enpassantRow].turn === turn - 1) {
			let direction = this.grid[pressedX][pressedY].colorName === WHITE ? 1 : -1;

			this.grid[pressedX][enpassantRow] = null;
		}

		if (option.extra === CASTLE) {
			// move rook in castling
			if (currX < pressedX) {
				this.grid[pressedX - 1][pressedY] = this.grid[columns - 1][pressedY];
				this.grid[columns - 1][pressedY] = null;
			} else {
				this.grid[pressedX + 1][pressedY] = this.grid[0][pressedY];
				this.grid[0][pressedY] = null;
			}
		}

		if (this.mainBoard) {
			if (turnColour === BLACK) whiteTimerStart();
			else blackTimerStart();

			turnColour = turnColour === WHITE ? BLACK : WHITE;
			if (turnColour === WHITE) {
				timeWhite += increment;
				timerWhite.innerText = formatTime(timeWhite);
			} else {
				timeBlack += increment;
				timerBlack.innerText = formatTime(timeBlack);
			}
		}

		// check if enemy king is in check
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (!isEmpty(i, j, this.grid) && this.grid[i][j].type === 'King' && this.grid[i][j].colorName === col) {
					if (this.grid !== grid) continue;

					if (isBeingAttacked(col, i, j, ...Array(4), this.grid)) {
						this.grid.inCheck = col;
						if (this.mainBoard) document.getElementById('check').innerText = `${turnColour} is in check`;
					} else {
						this.grid.inCheck = null;
						document.getElementById('check').innerText = `${turnColour}'s turn`;
					}
					break;
				}
			}
		}

		this.grid.options = [];

		if (this.grid === grid) turn++;

		option.piece = pieceinoption;
	}
}
