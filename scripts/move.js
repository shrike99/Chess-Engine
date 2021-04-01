function findMoves(pressedX, pressedY, Grid = grid) {
	var startDate = new Date();

	Grid[pressedX][pressedY].findLegalMoves(pressedX, pressedY);

	if (Grid[pressedX][pressedY].type === "King") {
		options = options.filter((option) => {
			return !isBeingAttacked(turnColour, option.endX, option.endY, pressedX, pressedY);
		});
	} else {
		for (var i = 0; i < Grid.length; i++) {
			for (var j = 0; j < Grid[i].length; j++) {
				if (!isOpen(i, j, Grid) && Grid[i][j].type === "King" && Grid[i][j].colorName === turnColour) {
					options = options.filter((option) => {
						return !isBeingAttacked(turnColour, i, j, pressedX, pressedY, option.endX, option.endY);
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

function EvaluateMove(x1, y1, move, col, _grid) {
	var { endX, endY } = move;

	var piece = _grid[x1][y1];

	_grid[endX][endY] = piece;

	_grid[x1][y1] = null;

	var black = getBlack(_grid);
	var white = getWhite(_grid);

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

		if (Grid[currX][currY].type == "Pawn" && (pressedY == currX + 2 || pressedY == currY - 2)) {
			canEnPassant = true;
			enPassantCoords = [pressedX, pressedY];
		}

		Grid[pressedX][pressedY] = Grid[currX][currY];
		Grid[currX][currY] = null;

		if (option.extra == ENPASSANT) {
			const enpassantRow = Grid[pressedX][pressedY].colorName == WHITE ? 3 : 4;
			console.log(enPassantCoords[0], pressedX, enPassantCoords[0] == pressedX && enPassantCoords[1] == enpassantRow);
			if (canEnPassant && enPassantCoords[0] == pressedX && enPassantCoords[1] == enpassantRow) {
				console.log(pressedX, enpassantRow, Grid[pressedX][enpassantRow]);
				Grid[pressedX][enpassantRow] = null;
				canEnPassant = false;
			}
		} else {
			if (canEnPassant) {
				canEnPassant = false;
			}
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
					if (isBeingAttacked(turnColour, i, j)) {
						grid.inCheck = turnColour;
						document.getElementById("check").innerText = `${turnColour} is in check`;
					} else {
						grid.inCheck = null;
						document.getElementById("check").innerText = `${turnColour}'s turn`;
					}
					break;
				}
			}
		}

		options = [];

		option.piece = pieceinoption;
	} catch {
		console.log(Grid, option);
	}
}
