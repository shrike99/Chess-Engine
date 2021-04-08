async function initGrid(board) {
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(rows);
		for (var j = 0; j < grid[i].length; j++) {
			if (j === 1) {
				grid[i][j] = new Pawn(BLACK);
			} else if (j === rows - 2) {
				grid[i][j] = new Pawn(WHITE);
			} else if (i === 0 || i === columns - 1) {
				if (j === 0) {
					grid[i][j] = new Rook(BLACK);
				} else if (j === rows - 1) {
					grid[i][j] = new Rook(WHITE);
				}
			} else if (i === 1 || i === columns - 2) {
				if (j === 0) {
					grid[i][j] = new Knight(BLACK);
				} else if (j === rows - 1) {
					grid[i][j] = new Knight(WHITE);
				}
			} else if (i === 2 || i === columns - 3) {
				if (j === 0) {
					grid[i][j] = new Bishop(BLACK);
				} else if (j === rows - 1) {
					grid[i][j] = new Bishop(WHITE);
				}
			} else if (i === 3) {
				if (j === 0) {
					grid[i][j] = new Queen(BLACK);
				} else if (j === rows - 1) {
					grid[i][j] = new Queen(WHITE);
				}
			} else if (i === 4) {
				if (j === 0) {
					grid[i][j] = new King(BLACK);
				} else if (j === rows - 1) {
					grid[i][j] = new King(WHITE);
				}
			}
		}
	}
}

function getWhite(_grid) {
	var whitePieces = [];

	for (i = 0; i < _grid.length; i++) {
		for (j = 0; j < _grid[i].length; j++) {
			if (_grid[i][j] != undefined && _grid[i][j].colorName == WHITE) {
				whitePieces.push(_grid[i][j]);
			}
		}
	}
	return whitePieces;
}

function getBlack(_grid) {
	var blackPieces = [];

	for (i = 0; i < _grid.length; i++) {
		for (j = 0; j < _grid[i].length; j++) {
			if (_grid[i][j] != undefined && _grid[i][j].colorName == BLACK) {
				blackPieces.push(_grid[i][j]);
			}
		}
	}
	return blackPieces;
}

function getScore(pieces) {
	score = 0;
	for (i = 0; i < pieces.length; i++) {
		var piece = pieceScores.find((x) => x[0] == pieces[i].type);
		if (piece != undefined) {
			score += piece[1];
		}
	}
	return score;
}

function deepclone(grid) {
	var clone = [];
	for (i = 0; i < grid.length; i++) {
		clone[i] = [...grid[i]];
		for (j = 0; j < grid[i].length; j++) {
			clone[i][j] == grid[i][j];
		}
	}
	return clone;
}

function Mate(col, inCheck) {
	if (inCheck == col) {
		if (Grid.options.length == 0) {
			return true;
		}
	}
	return false;
}

function isUpperCase(n) {
	return n === n.toUpperCase();
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function isLowerCase(n) {
	return n === n.toLowerCase();
}

function isOpen(i, j, Grid = grid) {
	if (0 <= i && i < columns) {
		return !(Grid[i][j] instanceof Piece);
	} else return true;
}

function formatTime(time) {
	var remaining = time % 60;
	remaining = remaining < 10 ? "0" + remaining.toString() : remaining;
	time = Math.floor(time / 60);
	return `${time}:${remaining}`;
}

//bool
function isBeingAttackedMain(colorName, i, j, Grid) {
	// check for knights attacking
	const knightTest = [
		[i + 2, j - 1],
		[i + 2, j + 1],
		[i - 2, j - 1],
		[i - 2, j + 1],
		[i + 1, j + 2],
		[i - 1, j + 2],
		[i + 1, j - 2],
		[i - 1, j - 2],
	];
	for (let index = 0; index < knightTest.length; index++) {
		const [testI, testJ] = knightTest[index];
		if (!isOpen(testI, testJ) && Grid[testI][testJ].type === "Knight" && hasEnemy(colorName, testI, testJ, Grid)) {
			return true;
		}
	}

	// check for king attacking
	const kingTest = [
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

	for (let index = 0; index < kingTest.length; index++) {
		const [testI, testJ] = kingTest[index];
		if (!isOpen(testI, testJ) && Grid[testI][testJ].type === "King" && hasEnemy(colorName, testI, testJ, Grid)) {
			return true;
		}
	}

	// check for bishops / queen
	if (isAttackedWithIncrement(colorName, i + 1, j + 1, 1, 1, ["Bishop", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j - 1, -1, -1, ["Bishop", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i + 1, j - 1, 1, -1, ["Bishop", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j + 1, -1, 1, ["Bishop", "Queen"], Grid)) return true;

	//  check for rooks / queen
	if (isAttackedWithIncrement(colorName, i + 1, j, 1, 0, ["Rook", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i, j + 1, 0, 1, ["Rook", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j, -1, 0, ["Rook", "Queen"], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i, j - 1, 0, -1, ["Rook", "Queen"], Grid)) return true;

	// check for pawns
	const direction = colorName === BLACK ? 1 : -1;
	j += direction;

	if (!isOpen(i - 1, j, Grid) && Grid[i - 1][j].type === "Pawn" && hasEnemy(colorName, i - 1, j, Grid)) {
		return true;
	} else if (!isOpen(i + 1, j, Grid) && Grid[i + 1][j].type === "Pawn" && hasEnemy(colorName, i + 1, j, Grid)) {
		return true;
	}

	return false;
}

function isAttackedWithIncrement(colorName, i, j, iInc, jInc, types, Grid) {
	while (0 <= i && i < columns && 0 <= j && j < rows) {
		if (!isOpen(i, j, Grid)) {
			if (hasEnemy(colorName, i, j, Grid) && types.includes(Grid[i][j].type)) {
				return true;
			}
			break;
		}
		i += iInc;
		j += jInc;
	}
	return false;
}

function findWithIncrement(colorName, i, j, iInc, jInc, Grid) {
	var initI = i,
		initJ = j;
	while (0 <= i && i < columns && 0 <= j && j < rows) {
		if (isOpen(i, j, Grid)) {
			Grid.options.push(new Move(initI, initJ, i, j, moveScore(i, j)));
		} else {
			if (hasEnemy(colorName, i, j, Grid)) {
				Grid.options.push(new Move(initI, initJ, i, j, moveScore(i, j)));
			}
			break;
		}
		i += iInc;
		j += jInc;
	}
}

function pushOptionIfOpenOrEnemy(colorName, i, j, Grid) {
	if (0 <= i && i < columns && 0 <= j && j < rows && (isOpen(i, j, Grid) || hasEnemy(colorName, i, j, Grid))) {
		Grid.options.push(new Move(i, j, i, j, moveScore(i, j)));
	}
}
