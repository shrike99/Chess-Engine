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
const list = [];
let totest = [];

const four = test(4, new Board());

//console.log('1:', test(1, new Board()) === 20);
//console.log('2:', test(2, new Board()) === 400);
//console.log('3:', test(3, new Board()) === 8902);
console.log('4:', four, four === 197281); //WRONG AND TAKING AGES
//console.log('5:', test(5, new Board()) === 4865609);

function test(depth, BOARD, col = WHITE, curr = '') {
	if (depth === 0) {
		list.push(curr);
		return 1;
	}

	let moves = BOARD.getMoves(col),
		count = 0;

	for (let i = 0; i < moves.length; i++) {
		for (let j = 0; j < moves[i][1].length; j++) {
			let { initX, initY, endX, endY } = moves[i][1][j],
				endType = isEmpty(endX, endY, BOARD.grid) ? 'EMPTY' : BOARD.grid[endX][endY].constructor.name,
				initType = BOARD.grid[initX][initY].constructor.name,
				update = curr,
				y = new Board(BOARD.grid);

			//update += `[${change(initX, initY)}-${change(endX, endY)}:${initType}-${endType}];`;
			update += `[${change(initX, initY)}-${change(endX, endY)}];`;

			y.MovePiece(initX, initY, endX, endY, moves[i][1][j], col);
			let rev = col === WHITE ? BLACK : WHITE;
			count += test(depth - 1, y, rev, update);
		}
	}
	return count;
}

function change(a, b) {
	const l = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	return l[a] + (8 - b).toString();
}

//
//
//
//

document.getElementById('input-file').addEventListener('change', getFile);

function getFile(event) {
	const input = event.target;
	if ('files' in input && input.files.length > 0) {
		consoleLog(input.files[0]);
	}
}

function consoleLog(file) {
	readFileContent(file)
		.then((content) => {
			totest = content.split(':');
			//let s = list.join(':');
			//for (let i = 0; i < totest.length; i++) {
			//	s = s.replace(totest[i], '');
			//	//if (i % 1999 === 0) console.log(s.length);
			//}
			//s.replace(':', '');

			//console.log(s);
		})
		.catch((error) => console.log(error));
}

function readFileContent(file) {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = (event) => resolve(event.target.result);
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
}
