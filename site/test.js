let x = new Board();
let moves = x.getMoves(WHITE);
console.log(x.grid, moves);

let y = new Board(x.grid);

const { initX, initY, endX, endY } = moves[0][1][0];
x.MovePiece(initX, initY, endX, endY, moves[0][1][0]);

console.log(x.getZobrist(), y.getZobrist());
