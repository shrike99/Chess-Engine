function findMoves(pressedX, pressedY) {
  var startDate = new Date();

  grid[pressedX][pressedY].findLegalMoves(pressedX, pressedY);

  if (grid[pressedX][pressedY].type === "King") {
    options = options.filter((option) => {
      return !isBeingAttacked(
        turnColour,
        option.x,
        option.y,
        pressedX,
        pressedY
      );
    });
  } else {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        if (
          !isOpen(i, j) &&
          grid[i][j].type === "King" &&
          grid[i][j].colorName === turnColour
        ) {
          options = options.filter((option) => {
            return !isBeingAttacked(
              turnColour,
              i,
              j,
              pressedX,
              pressedY,
              option.x,
              option.y
            );
          });
          break;
        }
      }
    }
  }

  var endDate = new Date();
  var seconds = (endDate - startDate) / 1000000;

  console.log("Took", seconds);
}

var lastmove;

function MovePiece(currX, currY, pressedX, pressedY, Grid, fromsearch = false) {
  var pieceinoption = grid[pressedX][pressedY];

  var end = Grid[currX][currY].colorName == WHITE ? 0 : rows - 1;

  if (pressedY == end && Grid[currX][currY].type == "Pawn") {
    Grid[currX][currY] = new Queen(Grid[currX][currY].colorName);
  }

  Grid[currX][currY].moved = true;

  const option = options.find((x) => x.x === pressedX && x.y === pressedY);

  if (
    Grid[currX][currY].type == "Pawn" &&
    (pressedY == currX + 2 || pressedY == currY - 2)
  ) {
    canEnPassant = true;
    enPassantCoords = [pressedX, pressedY];
  }

  Grid[pressedX][pressedY] = Grid[currX][currY];
  Grid[currX][currY] = null;

  if (option.extra == ENPASSANT) {
    const enpassantRow = Grid[pressedX][pressedY].colorName == WHITE ? 3 : 4;
    console.log(
      enPassantCoords[0],
      pressedX,
      enPassantCoords[0] == pressedX && enPassantCoords[1] == enpassantRow
    );
    if (
      canEnPassant &&
      enPassantCoords[0] == pressedX &&
      enPassantCoords[1] == enpassantRow
    ) {
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

  if (!fromsearch) {
    turnColour = turnColour === WHITE ? BLACK : WHITE;
  }

  // check if enemy king is in check
  for (var i = 0; i < Grid.length; i++) {
    for (var j = 0; j < Grid[i].length; j++) {
      if (
        !isOpen(i, j) &&
        Grid[i][j].type === "King" &&
        Grid[i][j].colorName === turnColour
      ) {
        if (isBeingAttacked(turnColour, i, j)) {
          inCheck = turnColour;
          document.getElementById(
            "check"
          ).innerText = `${turnColour} is in check`;
        } else {
          inCheck = null;
          document.getElementById("check").innerText = `${turnColour}'s turn`;
        }
        break;
      }
    }
  }

  lastmove = [[currX, currY], option, pieceinoption];

  options = [];
}

function UndoMove() {
  if (lastmove != undefined) {
    var x = lastmove[0][0];
    var y = lastmove[0][1];
    var move = lastmove[1];

    var piece = grid[move.x][move.y];

    grid[move.x][move.y] = lastmove[2];
    grid[x][y] = piece;
  }

  options = [];
}
