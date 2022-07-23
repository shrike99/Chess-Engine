let white_king_img,
	black_king_img,
	white_pawn,
	black_pawn,
	white_queen,
	black_queen,
	white_rook,
	black_rook,
	white_knight,
	black_knight,
	white_bishop,
	black_bishop,
	turn = 0,
	turnColour = WHITE, // INITIAL TURN COLOUR
	stopGame = false,
	computerCol = BLACK,
	previousMoves = [];

const columns = 8,
	rows = 8,
	WIDTH = 640,
	HEIGHT = 640,
	w = WIDTH / columns,
	h = HEIGHT / rows;

let board = new Board(null, true),
	grid = board.grid;

let current = [],
	depthValue = +document.getElementById('depthInput').value,
	promotion = document.querySelector('input[name="promotion"]:checked').value;

function changePromotion(e) {
	promotion = e.value;
}

function loadImages() {
	black_king_img = loadImage('images/black_king.svg');
	white_king_img = loadImage('images/white_king.svg');
	black_pawn = loadImage('images/black_pawn.svg');
	white_pawn = loadImage('images/white_pawn.svg');
	black_queen = loadImage('images/black_queen.svg');
	white_queen = loadImage('images/white_queen.svg');
	black_rook = loadImage('images/black_rook.svg');
	white_rook = loadImage('images/white_rook.svg');
	black_knight = loadImage('images/black_knight.svg');
	white_knight = loadImage('images/white_knight.svg');
	black_bishop = loadImage('images/black_bishop.svg');
	white_bishop = loadImage('images/white_bishop.svg');
}

function setup() {
	loadImages();

	createCanvas(WIDTH, HEIGHT);
	timerInc.innerText = '+' + increment;
	timerBlack.innerText = formatTime(timeBlack);
	timerWhite.innerText = formatTime(timeWhite);
	whiteTimerStart();
}
