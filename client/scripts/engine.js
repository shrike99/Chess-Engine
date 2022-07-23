// TODO: PIECE MOBILITY, KING SAFETY, PAWN STRUCTURE, AGGRESSIVE PAWN PUSH

let pieceScores = [
		['Pawn', 100],
		['Bishop', 300],
		['Knight', 300],
		['Rook', 500],
		['Queen', 900],
		['King', 9000],
	],
	gonethrough = 0;

function getAllMoves(col, Grid = grid) {
	let Pieces = [];

	for (i = 0; i < Grid.length; i++) {
		for (j = 0; j < Grid[i].length; j++) {
			if (!isEmpty(i, j, Grid) && Grid[i][j].colorName === col) {
				Pieces.push([i, j]);
			}
		}
	}
	let pieceMovesList = [];

	for (i = 0; i < Pieces.length; i++) {
		let x = Pieces[i][0];
		let y = Pieces[i][1];

		current = [x, y];
		findMoves(x, y, Grid);

		if (Grid.options.length != 0) {
			pieceMovesList.push([current, Grid.options, Grid[x][y]]);
		}
		Grid.options = [];
	}

	return pieceMovesList;
}

let d = [];

function Search(depth, col, alpha, beta, _Board) {
	if (depth === 0) {
		let e = _Board.EvaluatePosition(col);
		d.push(e);
		return e;
	}

	let pieceMovesList = SortMoves(getAllMoves(col, _Board.grid));

	if (pieceMovesList.length === 0) {
		//MATE
		if (Mate(col, _Board.grid.inCheck, _Board.grid)) return -Infinity;
		//STALEMATE
		else return 0;
	}

	let othercol = col === WHITE ? BLACK : WHITE;

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			let { initX, initY, endX, endY } = currMove;

			if (_Board.grid[initX][initY] === undefined) {
				console.warn(pieceMovesList);
				return;
			}

			MovePiece(initX, initY, endX, endY, _Board.grid, currMove, true);

			gonethrough++;

			let val = -Search(depth - 1, othercol, -beta, -alpha, new Board(_Board.grid), null);

			if (val >= beta) return beta;

			alpha = Math.max(val, alpha);
		});
	});

	return alpha;
}

function compareScores(a, b) {
	if (a.score < b.score) return 1;
	if (a.score > b.score) return -1;
	return 0;
}

function SortMoves(moves) {
	for (i = 0; i < moves.length; i++) {
		moves[i][1].sort(compareScores);
	}

	return moves;
}

function getPressure(x, y, col, Grid) {
	let pieceMovesList = getAllMoves(col, Grid);
	for (let i = 0; i < pieceMovesList.length; i++) {}
}

function moveScore(initX, initY, endX, endY, Grid) {
	try {
		let score = 0;

		//taking a piece
		if (Grid[endX][endY]) score += 10 * PieceScore(Grid[endX][endY]) - 10 * PieceScore(Grid[initX][initY]);
		//promoting
		if (Grid[initX][initY].type === 'Pawn' && (endY === 0 || endY === 7)) {
			score += 900;
		}

		return score;
	} catch {
		console.error(initX, initY, endX, endY, Grid);
	}
}
