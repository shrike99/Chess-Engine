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

		if (options.length != 0) {
			pieceMovesList.push([current, options, Grid[x][y]]);
		}
		options = [];
	}

	return pieceMovesList;
}

var highest = -100;
var bestMove = [];

function SearchWithin(x, y, move, col, depth, Grid, rootmove = [x, y, move]) {
	if (depth == 0) {
		var eval = EvaluatePosition(Grid);
		if (highest < eval) {
			highest = eval;
			bestMove = rootmove;
		}
		// console.log("❔ - SearchWithin - eval", eval);
		return eval;
	}

	var othercol = col == WHITE ? BLACK : WHITE;

	var { endX, endY } = move;

	MovePiece(x, y, endX, endY, Grid, move, true);

	var pieceMovesList = getAllMoves(othercol, Grid);

	pieceMovesList.forEach((element) => {
		element[1].forEach((curr) => {
			var currX = element[0][0];
			var currY = element[0][1];
			var eval = -SearchWithin(currX, currY, curr, othercol, depth - 1, deepclone(Grid), rootmove);
			if (highest < eval) {
				highest = eval;
				bestMove = rootmove;
			}
		});
	});
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
		if (Mate(col, grid.inCheck)) {
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

	var chosen = null;

	for (iI = 0; iI < pieceMovesList.length; iI++) {
		for (jI = 0; jI < pieceMovesList[iI][1].length; jI++) {
			var curr = pieceMovesList[iI][1][jI];
			var x = pieceMovesList[iI][0][0];
			var y = pieceMovesList[iI][0][1];

			var clone = deepclone(grid);

			//var eval = EvaluateMove(x, y, curr, col, clone)

			SearchWithin(x, y, curr, col, depth, clone);
		}
	}

	chosen = bestMove;

	var { endX, endY } = chosen[2];

	console.log("a");

	MovePiece(chosen[0], chosen[1], endX, endY, grid, chosen[2]);

	return chosen;
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
