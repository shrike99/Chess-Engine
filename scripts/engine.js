var pieceScores = [
	["Pawn", 1],
	["Bishop", 3],
	["Knight", 3],
	["Rook", 5],
	["Queen", 9],
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

var highest = -100;
var bestMove = [];

var rootmove;

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

function negaMax(col, depth, Grid) {
	if (depth == 0) {
		var e = EvaluatePosition(Grid, col);
		console.log("EVALUATION:", e);
		return e;
	}

	console.log("GRID:", Grid);

	var pieceMovesList = getAllMoves(col, Grid);
	var max = -1000;

	var othercol = col == WHITE ? BLACK : WHITE;

	pieceMovesList.forEach((element) => {
		element[1].forEach((currMove) => {
			var { initX, initY, endX, endY } = currMove;

			var tempG = deepclone(Grid);

			MovePiece(initX, initY, endX, endY, tempG, currMove, true);

			score = -negaMax(othercol, depth - 1, deepclone(tempG));

			console.log("RETURNED SCORE:", score);

			if (score > max) {
				max = score;
			}
		});
	});

	return max;
}

function Search(depth, col) {
	/*
  
  [x1,y1]
  [Move, Move]
  [Type]
  
  */

	var pieceMovesList = getAllMoves(col);

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

	var clone = deepclone(grid);
	console.log("❔ - Search - clone", clone);

	console.log("ANS:", negaMax(col, depth, clone));

	//SearchWithin(col, depth, deepclone(grid));

	// chosen = bestMove;

	// var { endX, endY } = chosen[2];

	// console.log("a");

	// MovePiece(chosen[0], chosen[1], endX, endY, grid, chosen[2]);

	// return chosen;
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

function moveScore(piece, x, y) {
	var pieceTake = grid[x][y];
	if (pieceTake != undefined) {
		var takeScore = pieceScores.find((x) => x[0] == pieceTake.type)[1];
		var pieceScore = pieceScores.find((x) => x[0] == pieceScore.type)[1];
		console.log(pieceScore);
		return pieceScore;
	}
	return 0;
}
