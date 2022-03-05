function getWhite(_grid) {
	let whitePieces = [];

	for (i = 0; i < _grid.length; i++) {
		for (j = 0; j < _grid[i].length; j++) {
			if (_grid[i][j] != undefined && _grid[i][j].colorName === WHITE) {
				whitePieces.push(_grid[i][j]);
			}
		}
	}
	return whitePieces;
}

function getBlack(_grid) {
	let blackPieces = [];

	for (i = 0; i < _grid.length; i++) {
		for (j = 0; j < _grid[i].length; j++) {
			if (_grid[i][j] != undefined && _grid[i][j].colorName === BLACK) {
				blackPieces.push(_grid[i][j]);
			}
		}
	}
	return blackPieces;
}

function drawArrow(base, vec, myColor) {
	push();
	stroke(myColor);
	strokeWeight(3);
	fill(myColor);
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}

function getScore(pieces) {
	score = 0;
	for (i = 0; i < pieces.length; i++) {
		let piece = pieceScores.find((x) => x[0] === pieces[i].type);

		if (piece) score += piece[1];
	}
	return score;
}

function deepclone(Grid) {
	let clone = Grid.map(function (arr) {
		return [...arr];
	});
	return clone;
}

function Mate(col, inCheck, Grid) {
	if (inCheck === col) {
		if (Grid.options.length === 0) {
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

function isEmpty(i, j, Grid = grid) {
	if (0 <= i && i < columns) return !Grid[i][j];
	return true;
}

function formatTime(time) {
	let remaining = time % 60;

	remaining = remaining < 10 ? '0' + remaining.toString() : remaining;
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
		if (!isEmpty(testI, testJ, Grid) && Grid[testI][testJ].type === 'Knight' && hasEnemy(colorName, testI, testJ, Grid)) {
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
		if (!isEmpty(testI, testJ, Grid) && Grid[testI][testJ].type === 'King' && hasEnemy(colorName, testI, testJ, Grid)) {
			return true;
		}
	}
	// check for bishops / queen
	if (isAttackedWithIncrement(colorName, i + 1, j + 1, 1, 1, ['Bishop', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j - 1, -1, -1, ['Bishop', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i + 1, j - 1, 1, -1, ['Bishop', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j + 1, -1, 1, ['Bishop', 'Queen'], Grid)) return true;
	//  check for rooks / queen
	if (isAttackedWithIncrement(colorName, i + 1, j, 1, 0, ['Rook', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i, j + 1, 0, 1, ['Rook', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i - 1, j, -1, 0, ['Rook', 'Queen'], Grid)) return true;
	if (isAttackedWithIncrement(colorName, i, j - 1, 0, -1, ['Rook', 'Queen'], Grid)) return true;
	// check for pawns
	const direction = colorName === BLACK ? 1 : -1;
	j += direction;
	if (!isEmpty(i - 1, j, Grid) && Grid[i - 1][j].type === 'Pawn' && hasEnemy(colorName, i - 1, j, Grid)) {
		return true;
	} else if (!isEmpty(i + 1, j, Grid) && Grid[i + 1][j].type === 'Pawn' && hasEnemy(colorName, i + 1, j, Grid)) {
		return true;
	}
	return false;
}

function isAttackedWithIncrement(colorName, i, j, iInc, jInc, types, Grid) {
	while (0 <= i && i < columns && 0 <= j && j < rows) {
		if (!isEmpty(i, j, Grid)) {
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

function PieceScore(piece) {
	if (piece) {
		return pieceScores.find((x) => x[0] === piece.type)[1];
	}
	return 0;
}

function findWithIncrement(colorName, posI, posJ, i, j, iInc, jInc, Grid) {
	let initI = i,
		initJ = j;
	while (0 <= i && i < columns && 0 <= j && j < rows) {
		if (isEmpty(i, j, Grid)) {
			Grid.options.push(new Move(posI, posJ, i, j, moveScore(posI, posJ, i, j, deepclone(Grid))));
		} else {
			if (hasEnemy(colorName, i, j, Grid)) {
				Grid.options.push(new Move(posI, posJ, i, j, moveScore(posI, posJ, i, j, deepclone(Grid))));
			}
			break;
		}
		i += iInc;
		j += jInc;
	}
}

function pushOptionIfOpenOrEnemy(colorName, initI, initJ, i, j, Grid) {
	if (0 <= i && i < columns && 0 <= j && j < rows && (isEmpty(i, j, Grid) || hasEnemy(colorName, i, j, Grid))) {
		Grid.options.push(new Move(initI, initJ, i, j, moveScore(initI, initJ, i, j, deepclone(Grid))));
	}
}
