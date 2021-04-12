var pieceScores = [
	["Pawn", 100],
	["Bishop", 300],
	["Knight", 300],
	["Rook", 500],
	["Queen", 900],
	["King", 9000],
];

function getAllMoves(col, Grid = grid) {
	var Pieces = [];

	for (i = 0; i < Grid.length; i++) {
		for (j = 0; j < Grid[i].length; j++) {
			if (!isOpen(i, j, Grid) && Grid[i][j].colorName == col) {
				Pieces.push([i, j]);
			}
		}
	}
	var pieceMovesList = [];

	for (i = 0; i < Pieces.length; i++) {
		var x = Pieces[i][0];
		var y = Pieces[i][1];

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
	if (depth == 0) {
		var eval = EvaluatePosition(Grid);
		if (highest < eval) {
			highest = eval;
			bestMove = rootmove;
		}
		return;
	}

	var othercol = col == WHITE ? BLACK : WHITE;

	var pieceMovesList = getAllMoves(col, Grid);

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			console.log("❔ - move", currMove);
			console.log("❔ - Grid", Grid);
			var { initX, initY, endX, endY } = currMove;

			MovePiece(initX, initY, endX, endY, deepclone(Grid), currMove, true);
			console.log("❔ - Grid after", Grid);
			SearchWithin(othercol, depth - 1, deepclone(Grid));
		});
	});
}

var maxMove;

var gonethrough = 0;

// function negaMax(col, depth, Grid) {
// 	if (depth == 0) {
// 		var e = EvaluatePosition(Grid, col);
// 		return e;
// 	}

// 	var pieceMovesList = getAllMoves(col, Grid);

// 	if (pieceMovesList.length == 0) {
// 		//MATE
// 		if (Mate(col, Grid.inCheck, Grid)) {
// 			return Number.NEGATIVE_INFINITY;
// 		}
// 		//STALEMATE
// 		else {
// 			return 0;
// 		}
// 	}

// 	var max = -1000;

// 	var othercol = col == WHITE ? BLACK : WHITE;

// 	pieceMovesList.forEach((element) => {
// 		element[1].forEach((currMove) => {
// 			var { endX, endY } = currMove;

// 			currMove.initX = element[0][0];
// 			currMove.initY = element[0][1];

// 			var tempG = deepclone(Grid);

// 			MovePiece(element[0][0], element[0][1], endX, endY, tempG, currMove, true);

// 			gonethrough++;

// 			score = -negaMax(othercol, depth - 1, deepclone(tempG));

// 			if (score != NaN && score > max) {
// 				max = score;
// 			}
// 		});
// 	});
// 	return max;
// }

function negaMax(col, depth, alpha, beta, Grid) {
	if (depth == 0) {
		var e = EvaluatePosition(Grid, col);
		return e;
	}

	var pieceMovesList = getAllMoves(col, Grid);

	//pieceMovesList.splice(1);

	pieceMovesList = SortMoves(pieceMovesList);

	if (pieceMovesList.length == 0) {
		//MATE
		if (Mate(col, Grid.inCheck, Grid)) {
			return Number.NEGATIVE_INFINITY;
		}
		//STALEMATE
		else {
			return 0;
		}
	}

	//var max = -1000;

	var othercol = col == WHITE ? BLACK : WHITE;

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			var { initX, initY, endX, endY } = currMove;

			var tempG = deepclone(Grid);

			MovePiece(initX, initY, endX, endY, tempG, currMove, true);

			gonethrough++;

			score = -negaMax(othercol, depth - 1, -beta, -alpha, deepclone(tempG));

			if (score >= beta) {
				return beta; //cut it off
			}
			alpha = Math.max(alpha, score);
		});
	});
	return alpha;
}

function Search(depth, col) {
	/*
  
  [x1,y1]
  [Move, Move]
  [Type]
  
  */

	var clone = deepclone(grid);

	var pieceMovesList = getAllMoves(col, clone);

	if (pieceMovesList.length == 0) {
		//MATE
		if (Mate(col, grid.inCheck, grid)) {
			document.getElementById("check").innerText = `THE COMPUTER was mated ):`;
			stopGame = true;
			return -200;
		}
		//STALEMATE
		else {
			document.getElementById("check").innerText = `STALEMATE ):`;
			stopGame = true;
			return -100;
		}
	}

	var eval = negaMax(col, depth, -1000, -1000, clone);

	return [eval, maxMove];
}

function findHighest(arr) {
	var highestI = 0;
	var highestJ = 0;
	var highest = 0;

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

	if (highest == 0) {
		return 0;
	}

	return [highestI, highestJ];
}

function compareScores(a, b) {
	if (a.score < b.score) {
		return 1;
	}
	if (a.score > b.score) {
		return -1;
	}
	return 0;
}

function SortMoves(moves) {
	for (i = 0; i < moves.length; i++) {
		moves[i][1].sort(compareScores);
	}

	return moves;
}

function moveScore(initX, initY, endX, endY, Grid) {
	var score = 0;

	//taking a piece
	if (Grid[initX][initY]) {
		score += 10 * PieceScore(Grid[endX][endY]) - 10 * PieceScore(Grid[initX][initY]);
	} else {
		console.log("%c Piece is null! ", "font-style:bold; color: #fd4d4d");
	}

	//promoting
	if (Grid[initX][initY].type == "PAWN") {
		score += 900;
	}

	if (score > 0) {
		console.log(`%c Returned score is: ${score}`, "font-style:bold; color: #bada55");
	}

	return score;
}
