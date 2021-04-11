function findMoves(pressedX, pressedY, Grid = grid) {
	var startDate = new Date();

	Grid[pressedX][pressedY].findLegalMoves(pressedX, pressedY, Grid);

	if (Grid[pressedX][pressedY].type === "King") {
		Grid.options = Grid.options.filter((option) => {
			return !isBeingAttacked(turnColour, option.endX, option.endY, pressedX, pressedY, ...Array(2), deepclone(Grid));
		});
	} else {
		for (var i = 0; i < Grid.length; i++) {
			for (var j = 0; j < Grid[i].length; j++) {
				if (!isOpen(i, j, Grid) && Grid[i][j].type === "King" && Grid[i][j].colorName === turnColour) {
					Grid.options = Grid.options.filter((option) => {
						return !isBeingAttacked(turnColour, i, j, pressedX, pressedY, option.endX, option.endY, Grid);
					});
					break;
				}
			}
		}
	}

	var endDate = new Date();
	var seconds = (endDate - startDate) / 1000000;

	//console.log("Took", seconds);
}

function EvaluatePosition(grid, col = computerCol) {
	var black = getBlack(grid);
	var white = getWhite(grid);

	var blackScore = getScore(black);
	var whiteScore = getScore(white);

	//console.log("EVALUATION FOUND:", col == WHITE ? whiteScore - blackScore : blackScore - whiteScore);

	return col == WHITE ? whiteScore - blackScore : blackScore - whiteScore;
}

function EvaluateMove(x1, y1, move, col, Grid) {
	var { endX, endY } = move;

	var piece = Grid[x1][y1];

	Grid[endX][endY] = piece;

	Grid[x1][y1] = null;

	var black = getBlack(Grid);
	var white = getWhite(Grid);

	var blackScore = getScore(black);
	var whiteScore = getScore(white);

	return col == WHITE ? whiteScore - blackScore : blackScore - whiteScore;
}

function MovePiece(currX, currY, pressedX, pressedY, Grid, option, issearching = false) {
	try {
		var pieceinoption = Grid[pressedX][pressedY];

		var end = Grid[currX][currY].colorName == WHITE ? 0 : rows - 1;

		if (pressedY == end && Grid[currX][currY].type == "Pawn") {
			Grid[currX][currY] = new Queen(Grid[currX][currY].colorName);
		}

		Grid[currX][currY].moved = true;

		//const option = options.find((x) => x.endX === pressedX && x.endY === pressedY);

		Grid[pressedX][pressedY] = Grid[currX][currY];
		Grid[currX][currY] = null;

		const enpassantRow = Grid[pressedX][pressedY].colorName == WHITE ? 3 : 4;

		if (option.extra == DOUBLE) {
			Grid[pressedX][pressedY].turn = turn;
		}

		if (option.extra == ENPASSANT && Grid[pressedX][enpassantRow].turn == turn - 1) {
			var direction = Grid[pressedX][pressedY].colorName == WHITE ? 1 : -1;

			Grid[pressedX][enpassantRow] = null;
		}

		if (option.extra === CASTLE) {
			// move rook in castling
			if (currX < pressedX) {
				Grid[pressedX - 1][pressedY] = Grid[columns - 1][pressedY];
				Grid[columns - 1][pressedY] = null;
			} else {
				Grid[pressedX + 1][pressedY] = Grid[0][pressedY];
				Grid[0][pressedY] = null;
			}
		}

		if (!issearching) {
			if (turnColour == BLACK) {
				whiteTimerStart();
			} else {
				blackTimerStart();
			}
			turnColour = turnColour === WHITE ? BLACK : WHITE;
			if (turnColour == WHITE) {
				timeWhite += increment;
				timerWhite.innerText = formatTime(timeWhite);
			} else {
				timeBlack += increment;
				timerBlack.innerText = formatTime(timeBlack);
			}
		}

		// check if enemy king is in check
		for (var i = 0; i < Grid.length; i++) {
			for (var j = 0; j < Grid[i].length; j++) {
				if (!isOpen(i, j, Grid) && Grid[i][j].type === "King" && Grid[i][j].colorName === turnColour) {
					if (isBeingAttacked(turnColour, i, j, ...Array(4), Grid)) {
						Grid.inCheck = turnColour;
						document.getElementById("check").innerText = `${turnColour} is in check`;
					} else {
						Grid.inCheck = null;
						document.getElementById("check").innerText = `${turnColour}'s turn`;
					}
					break;
				}
			}
		}

		Grid.options = [];

		if (Grid == grid) {
			turn++;
		}

		option.piece = pieceinoption;
	} catch {
		console.log("❔ - Error moving piece", currX, currY, pressedX, pressedY, Grid, option, issearching);
	}
}
