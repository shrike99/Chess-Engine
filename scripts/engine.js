var pieceScores = [
  ["Pawn", 1],
  ["Bishop", 3],
  ["Knight", 3],
  ["Rook", 5],
  ["Queen", 9],
];

function getAllMoves(col) {
  var Pieces = [];

  for (i = 0; i < grid.length; i++) {
    for (j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != undefined && grid[i][j].colorName == col) {
        Pieces.push([i, j]);
      }
    }
  }

  var pieceMovesList = [];

  for (i = 0; i < Pieces.length; i++) {
    var x = Pieces[i][0];
    var y = Pieces[i][1];

    current = [x, y];
    findMoves(x, y);

    if (options.length != 0) {
      pieceMovesList.push([current, options, grid[x][y]]);
    }
    options = [];
  }

  return pieceMovesList;
}

time = 0


function Search(depth, col) {
  // if (depth == 0) {
  //   return Evaluate(col, grid);
  // }

  /*
  
  [x1,y1]
  [Move, Move]
  [Type]
  
  */

  var pieceMovesList = getAllMoves(col)

  var othercol = col == WHITE ? BLACK : WHITE;



  if (pieceMovesList.length == 0) {
    //MATE
    if (Mate()) {
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

  var best = Number.NEGATIVE_INFINITY;

  console.log("l", pieceMovesList)

  for (i = 0; i < pieceMovesList.length; i++) {
    for (j = 0; j < pieceMovesList[i][1].length; j++) {
      if (time < 500) {
        var x = pieceMovesList[i][0][0];
        var y = pieceMovesList[i][0][1];

        var eval = EvaluateMove(x, y, pieceMovesList[i][1][j], col, deepclone(grid))

        console.log(eval)

        best = eval > best ? eval : best
        time++
      }

    }




    // for (j = 0; j < pieceMovesList[i][1].length; j++) {
    //   var x2 = pieceMovesList[i][1][j].x;
    //   var y2 = pieceMovesList[i][1][j].y;

    //   options.push(pieceMovesList[i][1][j]);

    //   MovePiece(x, y, x2, y2, grid, true);

    //   var evaluate = -Search(depth - 1, othercol);

    //   //UndoMove();

    //   best = Math.max(evaluate, best);
    // }
  }
  console.log("BEST:", best)
  return best;
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
    console.log(pieceScore)
    return pieceScore;
  }
  return 0;
}
