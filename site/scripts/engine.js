let pieceScores = [
	['Pawn', 100],
	['Bishop', 300],
	['Knight', 300],
	['Rook', 500],
	['Queen', 900],
	['King', 9000],
];

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

function SearchWithin(col, depth, Grid) {
	if (depth === 0) {
		let eval = EvaluatePosition(Grid);
		if (highest < eval) {
			highest = eval;
			bestMove = rootmove;
		}
		return;
	}

	let othercol = col === WHITE ? BLACK : WHITE;

	let pieceMovesList = getAllMoves(col, Grid);

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			console.log('❔ - move', currMove);
			console.log('❔ - Grid', Grid);
			let { initX, initY, endX, endY } = currMove;

			MovePiece(initX, initY, endX, endY, deepclone(Grid), currMove, true);
			console.log('❔ - Grid after', Grid);
			SearchWithin(othercol, depth - 1, deepclone(Grid));
		});
	});
}

let maxMove;

let gonethrough = 0;

function negaMax(col, depth, alpha, beta, Grid) {
	let best = -Infinity;
	if (depth === 0) {
		return EvaluatePosition(Grid, col);
	}

	let pieceMovesList = getAllMoves(col, Grid);
	pieceMovesList = SortMoves(pieceMovesList);

	if (pieceMovesList.length === 0) {
		//MATE
		if (Mate(col, Grid.inCheck, Grid)) return -Infinity;
		//STALEMATE
		else return 0;
	}

	let othercol = col === WHITE ? BLACK : WHITE;

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			let { initX, initY, endX, endY } = currMove;

			if (Grid[initX][initY] === undefined) {
				console.log(pieceMovesList);
				return;
			}

			MovePiece(initX, initY, endX, endY, Grid, currMove, true);

			let tempG = deepclone(Grid);

			gonethrough++;

			let val = -negaMax(othercol, depth - 1, -beta, -alpha, deepclone(tempG));
			best = Math.max(best, val);
			alpha = Math.max(alpha, val);

			if (alpha >= beta) return alpha;
		});
	});

	return best;
}

function getMoves(Grid, col, depth) {
	if (depth === 0) return 1;
	let pieceMovesList = getAllMoves(col, Grid);
	let num = 0;
	for (let i = 0; i < pieceMovesList.length; i++) {
		let { initX, initY, endX, endY } = pieceMovesList[i][1][0];
		MovePiece(initX, initY, endX, endY, Grid, pieceMovesList[i][1][0], true);
		num += getMoves(Grid, col === WHITE ? BLACK : WHITE, depth - 1);
	}
	return num;
}

//function negaMax(col, depth, alpha, beta, Grid) {
//	if (depth === 0) {
//		return EvaluatePosition(Grid, col);
//	}

//	let pieceMovesList = getAllMoves(col, Grid);

//	//pieceMovesList.splice(1);

//	pieceMovesList = SortMoves(pieceMovesList);

//	if (pieceMovesList.length === 0) {
//		//MATE
//		if (Mate(col, Grid.inCheck, Grid)) return -Infinity;
//		//STALEMATE
//		else return 0;
//	}

//	//let max = -1000;

//	let othercol = col === WHITE ? BLACK : WHITE;

//	pieceMovesList.forEach((element) => {
//		element[1].forEach((currMove) => {
//			let { initX, initY, endX, endY } = currMove;

//			let tempG = deepclone(Grid);

//			MovePiece(initX, initY, endX, endY, Grid, currMove, true);

//			gonethrough++;

//			score = -negaMax(othercol, depth - 1, -beta, -alpha, deepclone(tempG));

//			if (score > beta) {
//				return beta; //CUT IT OFF
//			}
//			alpha = Math.max(alpha, score);
//		});
//	});
//	return alpha;
//}

function Search(depth, col) {
	/*
  
  [x1,y1]
  [Move, Move]
  [Type]
  
  */

	let clone = deepclone(grid),
		pieceMovesList = getAllMoves(col, clone);

	if (pieceMovesList.length === 0) {
		//MATE
		if (Mate(col, grid.inCheck, grid)) {
			document.getElementById('check').innerText = `THE COMPUTER was mated ):`;
			stopGame = true;
			return -Infinity;
		}
		//STALEMATE
		else {
			document.getElementById('check').innerText = `STALEMATE ):`;
			stopGame = true;
			return -50; // TODO MAKE A DRAW GOOD BASED ON SITUATION
		}
	}
	//K1R1R3/1B6/P2q4/3bp2P/1P1p4/2Q5/k7/8 w - - 0 1
	let eval = negaMax(col, depth, -Infinity, -Infinity, clone);

	return [eval, maxMove];
}

function findHighest(arr) {
	let highestI = 0;
	let highestJ = 0;
	let highest = 0;

	for (i = 0; i < arr.length; i++) {
		for (j = 0; j < arr[i][1].length; j++) {
			if (arr[i][1][j].score > highest) {
				console.log(arr[i]);
				highestI = i;
				highestJ = j;
				highest = arr[i][1][j].score;
			}
		}
	}

	if (highest === 0) return 0;

	return [highestI, highestJ];
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
		if (Grid[initX][initY].type === 'PAWN') {
			score += 900;
		}

		return score;
	} catch {
		console.error(initX, initY, endX, endY, Grid);
	}
}
