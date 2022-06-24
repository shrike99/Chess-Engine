//let x = new Board([
//	[new King(WHITE), null, new Pawn(WHITE), null, null, null, new King(BLACK), null],
//	[null, new Bishop(WHITE), null, null, new Pawn(WHITE), null, null, null],
//	[new Rook(WHITE), null, null, null, null, new Queen(WHITE), null, null],
//	[null, null, new Queen(BLACK), new Bishop(BLACK), new Pawn(BLACK), null, null, null],
//	[new Rook(WHITE), null, new Pawn(BLACK), null, null, null, null],
//	[null, null, null, null, null, null, null, null],
//	[null, null, null, null, null, null, null, null],
//	[null, null, null, new Pawn(WHITE), null, null, null, null],
//]);

//console.log(x.EvaluatePosition(WHITE));

//console.log('1:', test(1, new Board()));
//console.log('2:', test(2, new Board()));
console.log('3:', test(3, new Board())); //WRONG
//console.log('4:', test(4, new Board())); //WRONG AND TAKING AGES
//console.log('5:', test(5, new Board()));

function test(depth, BOARD, col = WHITE) {
	if (depth === 0) return 1;

	let moves = BOARD.getMoves(col),
		count = 0;

	for (let i = 0; i < moves.length; i++) {
		for (let j = 0; j < moves[i][1].length; j++) {
			let y = new Board(BOARD.grid);
			const { initX, initY, endX, endY } = moves[i][1][j];

			y.MovePiece(initX, initY, endX, endY, moves[i][1][j], col);
			let rev = col === WHITE ? BLACK : WHITE;
			count += test(depth - 1, y, rev);
		}
	}
	return count;
}
