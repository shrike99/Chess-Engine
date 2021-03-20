async function initGrid(board) {
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
    for (var j = 0; j < grid[i].length; j++) {
      if (j === 1) {
        grid[i][j] = new Pawn(BLACK);
      } else if (j === rows - 2) {
        grid[i][j] = new Pawn(WHITE);
      } else if (i === 0 || i === columns - 1) {
        if (j === 0) {
          grid[i][j] = new Rook(BLACK);
        } else if (j === rows - 1) {
          grid[i][j] = new Rook(WHITE);
        }
      } else if (i === 1 || i === columns - 2) {
        if (j === 0) {
          grid[i][j] = new Knight(BLACK);
        } else if (j === rows - 1) {
          grid[i][j] = new Knight(WHITE);
        }
      } else if (i === 2 || i === columns - 3) {
        if (j === 0) {
          grid[i][j] = new Bishop(BLACK);
        } else if (j === rows - 1) {
          grid[i][j] = new Bishop(WHITE);
        }
      } else if (i === 3) {
        if (j === 0) {
          grid[i][j] = new Queen(BLACK);
        } else if (j === rows - 1) {
          grid[i][j] = new Queen(WHITE);
        }
      } else if (i === 4) {
        if (j === 0) {
          grid[i][j] = new King(BLACK);
        } else if (j === rows - 1) {
          grid[i][j] = new King(WHITE);
        }
      }
    }
  }
}

function isUpperCase(n) {
  return n === n.toUpperCase();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isLowerCase(n) {
  return n === n.toLowerCase();
}

//bool
function isBeingAttackedMain(colorName, i, j) {
  // check for knights attacking
  const knightTest = [
    [i + 2, j - 1],
    [i + 2, j + 1],
    [i - 2, j - 1],
    [i - 2, j + 1],
    [i + 1, j + 2],
    [i - 1, j + 2],
    [i + 1, j - 2],
    [i - 1, j - 2],
  ];
  for (let index = 0; index < knightTest.length; index++) {
    const [testI, testJ] = knightTest[index];
    if (
      !isOpen(testI, testJ) &&
      grid[testI][testJ].type === "Knight" &&
      hasEnemy(colorName, testI, testJ)
    ) {
      return true;
    }
  }

  // check for king attacking
  const kingTest = [
    [i + 1, j],
    [i + 1, j + 1],
    [i + 1, j - 1],
    [i, j],
    [i, j + 1],
    [i, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i - 1, j - 1],
  ];

  for (let index = 0; index < kingTest.length; index++) {
    const [testI, testJ] = kingTest[index];
    if (
      !isOpen(testI, testJ) &&
      grid[testI][testJ].type === "King" &&
      hasEnemy(colorName, testI, testJ)
    ) {
      return true;
    }
  }

  // check for bishops / queen
  if (
    isAttackedWithIncrement(colorName, i + 1, j + 1, 1, 1, ["Bishop", "Queen"])
  )
    return true;
  if (
    isAttackedWithIncrement(colorName, i - 1, j - 1, -1, -1, [
      "Bishop",
      "Queen",
    ])
  )
    return true;
  if (
    isAttackedWithIncrement(colorName, i + 1, j - 1, 1, -1, ["Bishop", "Queen"])
  )
    return true;
  if (
    isAttackedWithIncrement(colorName, i - 1, j + 1, -1, 1, ["Bishop", "Queen"])
  )
    return true;

  //  check for rooks / queen
  if (isAttackedWithIncrement(colorName, i + 1, j, 1, 0, ["Rook", "Queen"]))
    return true;
  if (isAttackedWithIncrement(colorName, i, j + 1, 0, 1, ["Rook", "Queen"]))
    return true;
  if (isAttackedWithIncrement(colorName, i - 1, j, -1, 0, ["Rook", "Queen"]))
    return true;
  if (isAttackedWithIncrement(colorName, i, j - 1, 0, -1, ["Rook", "Queen"]))
    return true;

  // check for pawns
  const direction = colorName === BLACK ? 1 : -1;
  j += direction;

  if (
    !isOpen(i - 1, j) &&
    grid[i - 1][j].type === "Pawn" &&
    hasEnemy(colorName, i - 1, j)
  ) {
    return true;
  } else if (
    !isOpen(i + 1, j) &&
    grid[i + 1][j].type === "Pawn" &&
    hasEnemy(colorName, i + 1, j)
  ) {
    return true;
  }

  return false;
}

function isAttackedWithIncrement(colorName, i, j, iInc, jInc, types) {
  while (0 <= i && i < columns && 0 <= j && j < rows) {
    if (!isOpen(i, j)) {
      if (hasEnemy(colorName, i, j) && types.includes(grid[i][j].type)) {
        return true;
      }
      break;
    }
    i += iInc;
    j += jInc;
  }
  return false;
}

function findWithIncrement(colorName, i, j, iInc, jInc) {
  while (0 <= i && i < columns && 0 <= j && j < rows) {
    if (isOpen(i, j)) {
      options.push(new Move(i, j, moveScore(i, j)));
    } else {
      if (hasEnemy(colorName, i, j)) {
        options.push(new Move(i, j, moveScore(i, j)));
      }
      break;
    }
    i += iInc;
    j += jInc;
  }
}

function pushOptionIfOpenOrEnemy(colorName, i, j) {
  if (
    0 <= i &&
    i < columns &&
    0 <= j &&
    j < rows &&
    (isOpen(i, j) || hasEnemy(colorName, i, j))
  ) {
    options.push(new Move(i, j, moveScore(i, j)));
  }
}
