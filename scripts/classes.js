const BLACK = "BLACK";
const WHITE = "WHITE";

const CASTLE = "CASTLE";

const ENPASSANT = "ENPASSANT";

function isOpen(i, j) {
  if (0 <= i && i < columns) {
    return !(grid[i][j] instanceof Piece);
  } else return true;
}

function hasEnemy(myColor, i, j) {
  const enemyColor = myColor === BLACK ? WHITE : BLACK;
  return grid[i][j] instanceof Piece && grid[i][j].colorName === enemyColor;
}

function isBeingAttacked(colorName, i, j, ignoreI, ignoreJ, fillI, fillJ) {
  if (ignoreI === undefined || ignoreJ === undefined) {
    return isBeingAttackedMain(colorName, i, j);
  }

  const ignoredPiece = grid[ignoreI][ignoreJ];
  grid[ignoreI][ignoreJ] = undefined;
  let filledPiece = fillI !== undefined && fillJ !== undefined ? grid[fillI][fillJ] : undefined;

  if (!isNaN(fillI) && !isNaN(fillJ)) {
    grid[fillI][fillJ] = new Filler(colorName);
  }

  if (isBeingAttackedMain(colorName, i, j)) {
    grid[ignoreI][ignoreJ] = ignoredPiece;
    if (!isNaN(fillI) && !isNaN(fillJ)) {
      grid[fillI][fillJ] = filledPiece;
    }
    return true;
  } else {
    grid[ignoreI][ignoreJ] = ignoredPiece;
    if (!isNaN(fillI) && !isNaN(fillJ)) {
      grid[fillI][fillJ] = filledPiece;
    }
    return false;
  }
}

class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color === BLACK ? 0 : 255;
    this.colorName = color;
    this.moved = false;
  }

  draw(i, j) {
    if (this.type == "King") {
      image(black_king_img, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_king_img, i * w, j * h);
      }
    }

    if (this.type == "Pawn") {
      image(black_pawn, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_pawn, i * w, j * h);
      }
    }

    if (this.type == "Queen") {
      image(black_queen, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_queen, i * w, j * h);
      }
    }

    if (this.type == "Rook") {
      image(black_rook, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_rook, i * w, j * h);
      }
    }

    if (this.type == "Knight") {
      image(black_knight, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_knight, i * w, j * h);
      }
    }

    if (this.type == "Bishop") {
      image(black_bishop, i * w, j * h);
      if (this.colorName == "WHITE") {
        image(white_bishop, i * w, j * h);
      }
    }
  }
}

class Pawn extends Piece {
  constructor(color) {
    super("Pawn", color);
  }
  findLegalMoves(i, j) {
    current = [i, j];
    options = [];
    const direction = this.colorName == WHITE ? -1 : 1;
    const enpassantrow = this.colorName == WHITE ? 3 : 4;
    let nextRow = j + direction;

    if (!isOpen(i + 1, j) && hasEnemy(this.colorName, i + 1, j) && j == enpassantrow) {
      if (canEnPassant && enPassantCoords[0] == i + 1 && enPassantCoords[1] == j) {
        options.push(new Move(i, j, i + 1, nextRow, moveScore(i + 1, nextRow), ENPASSANT));
      }
    }

    if (!isOpen(i - 1, j) && hasEnemy(this.colorName, i - 1, j) && j == enpassantrow) {
      if (canEnPassant && enPassantCoords[0] == i - 1 && enPassantCoords[1] == j) {
        options.push(new Move(i, j, i - 1, nextRow, moveScore(i - 1, nextRow), ENPASSANT));
      }
    }

    if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow)) {
      options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
      nextRow += direction;
      if (0 <= nextRow && nextRow < rows && isOpen(i, nextRow) && !this.moved) {
        options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
      }
    }
    nextRow = j + direction;

    i--;
    if (0 <= i && i < columns && hasEnemy(this.colorName, i, nextRow) && !isOpen(i, nextRow)) {
      options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
    }
    i += 2;
    if (0 <= i && i < columns && hasEnemy(this.colorName, i, nextRow) && !isOpen(i, nextRow)) {
      options.push(new Move(i, j, i, nextRow, moveScore(i, nextRow)));
    }
  }
}

class Rook extends Piece {
  constructor(color) {
    super("Rook", color);
  }

  findLegalMoves(i, j) {
    options = [];
    current = [i, j];

    findWithIncrement(this.colorName, i + 1, j, 1, 0);
    findWithIncrement(this.colorName, i, j + 1, 0, 1);
    findWithIncrement(this.colorName, i - 1, j, -1, 0);
    findWithIncrement(this.colorName, i, j - 1, 0, -1);
  }
}

class Knight extends Piece {
  constructor(color) {
    super("Knight", color);
  }

  findLegalMoves(i, j) {
    options = [];
    current = [i, j];

    const toTest = [
      [i + 2, j - 1],
      [i + 2, j + 1],
      [i - 2, j - 1],
      [i - 2, j + 1],
      [i + 1, j + 2],
      [i - 1, j + 2],
      [i + 1, j - 2],
      [i - 1, j - 2],
    ];

    for (let index = 0; index < toTest.length; index++) {
      const [testI, testJ] = toTest[index];
      pushOptionIfOpenOrEnemy(this.colorName, testI, testJ);
    }
  }
}

class Bishop extends Piece {
  constructor(color) {
    super("Bishop", color);
  }

  findLegalMoves(i, j) {
    options = [];
    current = [i, j];

    findWithIncrement(this.colorName, i + 1, j + 1, 1, 1);
    findWithIncrement(this.colorName, i - 1, j - 1, -1, -1);
    findWithIncrement(this.colorName, i + 1, j - 1, 1, -1);
    findWithIncrement(this.colorName, i - 1, j + 1, -1, 1);
  }
}

class King extends Piece {
  constructor(color) {
    super("King", color);
  }

  findLegalMoves(i, j) {
    current = [i, j];
    options = [];

    const toTest = [
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

    for (let index = 0; index < toTest.length; index++) {
      const [iTest, jTest] = toTest[index];
      pushOptionIfOpenOrEnemy(this.colorName, iTest, jTest);
    }

    // castling

    if (!this.moved && inCheck !== turnColour) {
      let testI = i + 1;
      while (testI < columns) {
        if (!isOpen(testI, j)) {
          break;
        }
        testI++;
      }

      if (grid[testI][j].type === "Rook" && !grid[testI][j].moved) {
        if (
          !isBeingAttacked(this.colorName, i + 1, j) &&
          !isBeingAttacked(this.colorName, i + 2, j)
        ) {
          console.log("rook found");
          options.push(new Move(i, j, i + 2, j, moveScore(i + 2, j), CASTLE));
        }
      }

      testI = i - 1;
      while (0 < testI) {
        if (!isOpen(testI, j)) {
          break;
        }
        testI--;
      }

      if (grid[testI][j].type === "Rook" && !grid[testI][j].moved) {
        if (
          !isBeingAttacked(this.colorName, i - 1, j) &&
          !isBeingAttacked(this.colorName, i - 2, j)
        ) {
          options.push(new Move(i, j, i - 2, j, moveScore(i - 2, j), CASTLE));
        }
      }
    }
  }
}

class Queen extends Piece {
  constructor(color) {
    super("Queen", color);
  }

  findLegalMoves(i, j) {
    options = [];
    current = [i, j];

    findWithIncrement(this.colorName, i + 1, j + 1, 1, 1);
    findWithIncrement(this.colorName, i - 1, j - 1, -1, -1);
    findWithIncrement(this.colorName, i + 1, j - 1, 1, -1);
    findWithIncrement(this.colorName, i - 1, j + 1, -1, 1);
    findWithIncrement(this.colorName, i + 1, j, 1, 0);
    findWithIncrement(this.colorName, i, j + 1, 0, 1);
    findWithIncrement(this.colorName, i - 1, j, -1, 0);
    findWithIncrement(this.colorName, i, j - 1, 0, -1);
  }
}

function Move(initX, initY, endX, endY, score, extra = "") {
  this.initX = initX;
  this.initY = initY;
  this.piece;
  this.endX = endX;
  this.endY = endY;
  this.score = score;
  this.extra = extra;
}

class Filler extends Piece {
  constructor(color) {
    super("Filler", color);
  }
}
