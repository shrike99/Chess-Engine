const BLACK = "BLACK";
const WHITE = "WHITE";

const CASTLE = "CASTLE";

const ENPASSANT = "ENPASSANT";

function hasEnemy(myColor, i, j, Grid) {
	const enemyColor = myColor === BLACK ? WHITE : BLACK;
	return Grid[i][j] instanceof Piece && Grid[i][j].colorName === enemyColor;
}

function isBeingAttacked(colorName, i, j, ignoreI, ignoreJ, fillI, fillJ, Grid) {
	if (ignoreI === undefined || ignoreJ === undefined) {
		return isBeingAttackedMain(colorName, i, j, Grid);
	}

	const ignoredPiece = Grid[ignoreI][ignoreJ];
	Grid[ignoreI][ignoreJ] = undefined;
	let filledPiece = fillI !== undefined && fillJ !== undefined ? Grid[fillI][fillJ] : undefined;

	if (!isNaN(fillI) && !isNaN(fillJ)) {
		Grid[fillI][fillJ] = new Filler(colorName);
	}

	if (isBeingAttackedMain(colorName, i, j, Grid)) {
		Grid[ignoreI][ignoreJ] = ignoredPiece;
		if (!isNaN(fillI) && !isNaN(fillJ)) {
			Grid[fillI][fillJ] = filledPiece;
		}
		return true;
	} else {
		Grid[ignoreI][ignoreJ] = ignoredPiece;
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
	}

	draw(i, j) {
		if (this.type == "King") {
			image(black_king_img, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_king_img, i * w, j * h);
			}
		}

		if (this.type == "Pawn") {
			image(black_pawn, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_pawn, i * w, j * h);
			}
		}

		if (this.type == "Queen") {
			image(black_queen, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_queen, i * w, j * h);
			}
		}

		if (this.type == "Rook") {
			image(black_rook, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_rook, i * w, j * h);
			}
		}

		if (this.type == "Knight") {
			image(black_knight, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_knight, i * w, j * h);
			}
		}

		if (this.type == "Bishop") {
			image(black_bishop, i * w, j * h);
			if (this.colorName == "WHITE") {
				image(white_bishop, i * w, j * h);
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
			if (Grid.canEnPassant && Grid.enPassantCoords[0] == i + 1 && Grid.enPassantCoords[1] == j) {
				Grid.options.push(new Move(i, j, i + 1, nextRow, moveScore(i + 1, nextRow), ENPASSANT));
			}
		}

		if (!isOpen(i - 1, j, Grid) && hasEnemy(this.colorName, i - 1, j, Grid) && j == enpassantrow) {
			if (Grid.canEnPassant && Grid.enPassantCoords[0] == i - 1 && Grid.enPassantCoords[1] == j) {
				Grid.options.push(new Move(i, j, i - 1, nextRow, moveScore(i - 1, nextRow), ENPASSANT));
			}
		}

		if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow, Grid)) {
			Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
			nextRow += direction;
			if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow, Grid) && !this.moved) {
				Grid.options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
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
			pushOptionIfOpenOrEnemy(this.colorName, testI, testJ, Grid);
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
			pushOptionIfOpenOrEnemy(this.colorName, iTest, jTest, Grid);
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
				if (!isBeingAttacked(this.colorName, i + 1, j, Grid) && !isBeingAttacked(this.colorName, i + 2, j, Grid)) {
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
				if (!isBeingAttacked(this.colorName, i - 1, j, Grid) && !isBeingAttacked(this.colorName, i - 2, j, Grid)) {
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
