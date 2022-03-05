function findMoves(pressedX, pressedY, Grid = grid) {
	Grid[pressedX][pressedY].findLegalMoves(pressedX, pressedY, Grid);

	if (Grid[pressedX][pressedY].type === 'King') {
		Grid.options = Grid.options.filter((option) => {
			return !isBeingAttacked(turnColour, option.endX, option.endY, pressedX, pressedY, ...Array(2), deepclone(Grid));
		});
	} else {
		for (let i = 0; i < Grid.length; i++) {
			for (let j = 0; j < Grid[i].length; j++) {
				if (!isEmpty(i, j, Grid) && Grid[i][j].type === 'King' && Grid[i][j].colorName === turnColour) {
					Grid.options = Grid.options.filter((option) => {
						return !isBeingAttacked(turnColour, i, j, pressedX, pressedY, option.endX, option.endY, Grid);
					});
					break;
				}
			}
		}
	}
}

function handlePromotion(currX, currY, Grid = grid) {
	Grid[currX][currY] = new Queen(Grid[currX][currY].colorName);
}

function MovePiece(currX, currY, pressedX, pressedY, Grid, option, isSearching = false) {
	try {
		let pieceinoption = Grid[pressedX][pressedY],
			end = Grid[currX][currY].colorName === WHITE ? 0 : rows - 1;

		if (pressedY === end && Grid[currX][currY].type === 'Pawn') {
			handlePromotion(currX, currY);
		}

		if (!isSearching) {
			Grid[currX][currY].moved = true;
		}

		Grid[pressedX][pressedY] = Grid[currX][currY];
		Grid[currX][currY] = null;

		const enpassantRow = Grid[pressedX][pressedY].colorName === WHITE ? 3 : 4;

		if (option.extra === DOUBLE) {
			Grid.hasEnPassant = true;
			Grid.enPassant = option;
		} else {
			Grid.hasEnPassant = false;
			Grid.enPassant = null;
		}

		if (option.extra === ENPASSANT) {
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

		if (!isSearching) {
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
		for (let i = 0; i < Grid.length; i++) {
			for (let j = 0; j < Grid[i].length; j++) {
				if (!isEmpty(i, j, Grid) && Grid[i][j].type === 'King' && Grid[i][j].colorName === turnColour) {
					if (Grid !== grid) continue;

					if (isBeingAttacked(turnColour, i, j, ...Array(4), Grid)) {
						Grid.inCheck = turnColour;
						document.getElementById('check').innerText = `${turnColour} is in check`;
					} else {
						Grid.inCheck = null;
						document.getElementById('check').innerText = `${turnColour}'s turn`;
					}
					break;
				}
			}
		}

		Grid.options = [];

		if (Grid === grid) turn++;

		option.piece = pieceinoption;
	} catch {
		//console.error('Error moving piece: ', currX, currY, pressedX, pressedY, Grid, option, isSearching);
	}
}
