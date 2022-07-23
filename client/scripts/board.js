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
		this.grid = new Array(8);
		this.mainBoard = main;
		this.history = [];

		this.grid.options = [];
		this.grid.inCheck = null;
		this.grid.hasEnPassant = false;
		this.grid.enPassant = null;
		this.grid.wKing = [4, 7];
		this.grid.bKing = [4, 0];

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
					if (copy[i][j] === King) {
						if (copy[i][j].colorName === WHITE) wKing = [i, j];
						else bKing = [i, j];
					}

					this.grid[i][j] = new copy[i][j].constructor(copy[i][j].colorName);
				}
			}
		}
	}

	loadInit() {
		for (let i = 0; i < this.grid.length; i++) this.grid[i] = new Array(8);

		this.grid[0][0] = new Rook(BLACK);
		this.grid[1][0] = new Knight(BLACK);
		this.grid[2][0] = new Bishop(BLACK);
		this.grid[3][0] = new Queen(BLACK);
		this.grid[4][0] = new King(BLACK);
		this.grid[5][0] = new Bishop(BLACK);
		this.grid[6][0] = new Knight(BLACK);
		this.grid[7][0] = new Rook(BLACK);

		this.grid[0][1] = new Pawn(BLACK);
		this.grid[1][1] = new Pawn(BLACK);
		this.grid[2][1] = new Pawn(BLACK);
		this.grid[3][1] = new Pawn(BLACK);
		this.grid[4][1] = new Pawn(BLACK);
		this.grid[5][1] = new Pawn(BLACK);
		this.grid[6][1] = new Pawn(BLACK);
		this.grid[7][1] = new Pawn(BLACK);

		this.grid[0][6] = new Pawn(WHITE);
		this.grid[1][6] = new Pawn(WHITE);
		this.grid[2][6] = new Pawn(WHITE);
		this.grid[3][6] = new Pawn(WHITE);
		this.grid[4][6] = new Pawn(WHITE);
		this.grid[5][6] = new Pawn(WHITE);
		this.grid[6][6] = new Pawn(WHITE);
		this.grid[7][6] = new Pawn(WHITE);

		this.grid[0][7] = new Rook(WHITE);
		this.grid[1][7] = new Knight(WHITE);
		this.grid[2][7] = new Bishop(WHITE);
		this.grid[3][7] = new Queen(WHITE);
		this.grid[4][7] = new King(WHITE);
		this.grid[5][7] = new Bishop(WHITE);
		this.grid[6][7] = new Knight(WHITE);
		this.grid[7][7] = new Rook(WHITE);
	}

	getMoves(col) {
		const pieceMovesList = [];

		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (!isEmpty(i, j, this.grid) && this.grid[i][j].colorName === col) {
					findMoves(i, j, this.grid);

					if (this.grid.options.length !== 0) {
						pieceMovesList.push([[i, j], this.grid.options, this.grid[i][j]]);
					}
					this.grid.options = [];
				}
			}
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

		this.grid[currX][currY].moved = true;

		if (pressedY === end && this.grid[currX][currY].type === 'Pawn') handlePromotion(currX, currY);

		this.grid[pressedX][pressedY] = this.grid[currX][currY];
		this.grid[currX][currY] = null;

		// EN PASSANT

		const enpassantRow = this.grid[pressedX][pressedY].colorName === WHITE ? 3 : 4;

		if (option.extra === DOUBLE) {
			this.grid.hasEnPassant = true;
			this.grid.enPassant = option;
		} else {
			this.grid.hasEnPassant = false;
			this.grid.enPassant = null;
		}

		if (option.extra === ENPASSANT) {
			this.grid[pressedX][enpassantRow] = null;
		}

		// CASTLE

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

		// TIMER

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

		if (pieceinoption === King) updateKingPosition(this.grid, pressedX, pressedY, col);

		this.grid.options = [];

		if (this.grid === grid) turn++;

		option.piece = pieceinoption;
	}
}
