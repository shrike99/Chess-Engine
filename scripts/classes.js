const BLACK = "BLACK";
const WHITE = "WHITE";

const CASTLE = "CASTLE";
const ENPASSANT = "ENPASSANT";
const DOUBLE = "DOUBLE";

function hasEnemy(myColor, i, j, Grid) {
	const enemyColor = myColor === BLACK ? WHITE : BLACK;
	return Grid[i][j] instanceof Piece && Grid[i][j].colorName === enemyColor;
}

function isBeingAttacked(colorName, endI, endJ, i, j, fillI, fillJ, Grid) {
	if (i === undefined || j === undefined) {
		return isBeingAttackedMain(colorName, endI, endJ, Grid);
	}

	const ignoredPiece = Grid[i][j];
	Grid[i][j] = undefined;
	let filledPiece = fillI !== undefined && fillJ !== undefined ? Grid[fillI][fillJ] : undefined;

	if (!isNaN(fillI) && !isNaN(fillJ)) {
		Grid[fillI][fillJ] = new Filler(colorName);
	}

	if (isBeingAttackedMain(colorName, endI, endJ, Grid)) {
		Grid[i][j] = ignoredPiece;
		if (!isNaN(fillI) && !isNaN(fillJ)) {
			Grid[fillI][fillJ] = filledPiece;
		}
		return true;
	} else {
		Grid[i][j] = ignoredPiece;
		if (!isNaN(fillI) && !isNaN(fillJ)) {
			Grid[fillI][fillJ] = filledPiece;
		}
		return false;
	}
}

class Piece {
	constructor(type, color) {
		this.type = type;
		this.color = color === BLACK ? 0 : 255;
		this.colorName = color;
		this.moved = false;
		this.turn = -1;
	}

	draw(i, j) {
		if (this.type == "King") {
			if (this.colorName == "WHITE") {
				image(white_king_img, i * w, j * h);
			} else {
				image(black_king_img, i * w, j * h);
			}
		}

		if (this.type == "Pawn") {
			if (this.colorName == "WHITE") {
				image(white_pawn, i * w, j * h);
			} else {
				image(black_pawn, i * w, j * h);
			}
		}

		if (this.type == "Queen") {
			if (this.colorName == "WHITE") {
				image(white_queen, i * w, j * h);
			} else {
				image(black_queen, i * w, j * h);
			}
		}

		if (this.type == "Rook") {
			if (this.colorName == "WHITE") {
				image(white_rook, i * w, j * h);
			} else {
				image(black_rook, i * w, j * h);
			}
		}

		if (this.type == "Knight") {
			if (this.colorName == "WHITE") {
				image(white_knight, i * w, j * h);
			} else {
				image(black_knight, i * w, j * h);
			}
		}

		if (this.type == "Bishop") {
			if (this.colorName == "WHITE") {
				image(white_bishop, i * w, j * h);
			} else {
				image(black_bishop, i * w, j * h);
			}
		}
	}
}

class Pawn extends Piece {
	constructor(color) {
		super("Pawn", color);
	}
	findLegalMoves(i, j, Grid = grid) {
		current = [i, j];
		Grid.options = [];
		const direction = this.colorName == WHITE ? -1 : 1;
		const enpassantrow = this.colorName == WHITE ? 3 : 4;
		let nextRow = j + direction;

		if (!isOpen(i + 1, j, Grid) && hasEnemy(this.colorName, i + 1, j, Grid) && j == enpassantrow) {
			if (Grid[i + 1][nextRow + direction * -1].turn == turn - 1 || Grid[i + 1][nextRow + direction * -1].turn == -1) {
				Grid.options.push(new Move(i, j, i + 1, nextRow, moveScore(i + 1, nextRow), ENPASSANT));
			}
		}

		if (!isOpen(i - 1, j, Grid) && hasEnemy(this.colorName, i - 1, j, Grid) && j == enpassantrow) {
			if (Grid[i - 1][nextRow + direction * -1].turn == turn - 1 || Grid[i - 1][nextRow + direction * -1].turn == -1) {
				Grid.options.push(new Move(i, j, i - 1, nextRow, moveScore(i - 1, nextRow), ENPASSANT));
			}
		}

		if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow, Grid)) {
			Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
			nextRow += direction;
			if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow, Grid) && !this.moved) {
				Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow), DOUBLE));
			}
		}
		nextRow = j + direction;

		i--;
		if (0 <= i && i < columns && hasEnemy(this.colorName, i, nextRow, Grid) && !isOpen(i, nextRow, Grid)) {
			Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
		}
		i += 2;
		if (0 <= i && i < columns && hasEnemy(this.colorName, i, nextRow, Grid) && !isOpen(i, nextRow, Grid)) {
			Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
		}
	}
}

class Rook extends Piece {
	constructor(color) {
		super("Rook", color);
	}

	findLegalMoves(i, j, Grid) {
		Grid.options = [];
		current = [i, j];

		findWithIncrement(this.colorName, i + 1, j, 1, 0, Grid);
		findWithIncrement(this.colorName, i, j + 1, 0, 1, Grid);
		findWithIncrement(this.colorName, i - 1, j, -1, 0, Grid);
		findWithIncrement(this.colorName, i, j - 1, 0, -1, Grid);
	}
}

class Knight extends Piece {
	constructor(color) {
		super("Knight", color);
	}

	findLegalMoves(i, j, Grid) {
		Grid.options = [];
		current = [i, j];

		const toTest = [
			[i + 2, j - 1],
			[i + 2, j + 1],
			[i - 2, j - 1],
			[i - 2, j + 1],
			[i + 1, j + 2],
			[i - 1, j + 2],
			[i + 1, j - 2],
			[i - 1, j - 2],
		];

		for (let index = 0; index < toTest.length; index++) {
			const [testI, testJ] = toTest[index];
			pushOptionIfOpenOrEnemy(this.colorName, i, j, testI, testJ, Grid);
		}
	}
}

class Bishop extends Piece {
	constructor(color) {
		super("Bishop", color);
	}

	findLegalMoves(i, j, Grid) {
		Grid.options = [];
		current = [i, j];

		findWithIncrement(this.colorName, i + 1, j + 1, 1, 1, Grid);
		findWithIncrement(this.colorName, i - 1, j - 1, -1, -1, Grid);
		findWithIncrement(this.colorName, i + 1, j - 1, 1, -1, Grid);
		findWithIncrement(this.colorName, i - 1, j + 1, -1, 1, Grid);
	}
}

class King extends Piece {
	constructor(color) {
		super("King", color);
	}

	findLegalMoves(i, j, Grid) {
		current = [i, j];
		Grid.options = [];

		const toTest = [
			[i + 1, j],
			[i + 1, j + 1],
			[i + 1, j - 1],
			[i, j],
			[i, j + 1],
			[i, j - 1],
			[i - 1, j],
			[i - 1, j + 1],
			[i - 1, j - 1],
		];

		for (let index = 0; index < toTest.length; index++) {
			const [iTest, jTest] = toTest[index];
			pushOptionIfOpenOrEnemy(this.colorName, i, j, iTest, jTest, Grid);
		}

		// castling

		if (!this.moved && Grid.inCheck !== turnColour) {
			let testI = i + 1;
			while (testI < columns) {
				if (!isOpen(testI, j, Grid)) {
					break;
				}
				testI++;
			}

			if (Grid[testI][j].type === "Rook" && !Grid[testI][j].moved) {
				if (!isBeingAttacked(this.colorName, i + 1, j, ...Array(4), Grid) && !isBeingAttacked(this.colorName, i + 2, j, ...Array(4), Grid)) {
					console.log("rook found");
					Grid.options.push(new Move(i, j, i + 2, j, moveScore(i + 2, j), CASTLE));
				}
			}

			testI = i - 1;
			while (0 < testI) {
				if (!isOpen(testI, j, Grid)) {
					break;
				}
				testI--;
			}

			if (Grid[testI][j].type === "Rook" && !Grid[testI][j].moved) {
				if (!isBeingAttacked(this.colorName, i - 1, j, ...Array(4), Grid) && !isBeingAttacked(this.colorName, i - 2, j, ...Array(4), Grid)) {
					Grid.options.push(new Move(i, j, i - 2, j, moveScore(i - 2, j), CASTLE));
				}
			}
		}
	}
}

class Queen extends Piece {
	constructor(color) {
		super("Queen", color);
	}

	findLegalMoves(i, j, Grid) {
		Grid.options = [];
		current = [i, j];

		findWithIncrement(this.colorName, i + 1, j + 1, 1, 1, Grid);
		findWithIncrement(this.colorName, i - 1, j - 1, -1, -1, Grid);
		findWithIncrement(this.colorName, i + 1, j - 1, 1, -1, Grid);
		findWithIncrement(this.colorName, i - 1, j + 1, -1, 1, Grid);
		findWithIncrement(this.colorName, i + 1, j, 1, 0, Grid);
		findWithIncrement(this.colorName, i, j + 1, 0, 1, Grid);
		findWithIncrement(this.colorName, i - 1, j, -1, 0, Grid);
		findWithIncrement(this.colorName, i, j - 1, 0, -1, Grid);
	}
}

function Move(initX, initY, endX, endY, score, extra = "") {
	this.initX = initX;
	this.initY = initY;
	this.piece;
	this.endX = endX;
	this.endY = endY;
	this.score = score;
	this.extra = extra;
}

class Filler extends Piece {
	constructor(color) {
		super("Filler", color);
	}
}
