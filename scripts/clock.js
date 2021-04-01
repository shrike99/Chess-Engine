var whiteTimer;
var blackTimer;

var timeBlack = 10;
var timeWhite = 10;
var increment = 3;

function blkTicker() {
	if (timeBlack > 0) {
		timeBlack--;
		var time = formatTime(timeBlack);

		timerBlack.innerText = time;
	}
}
function whtTicker() {
	if (timeWhite > 0) {
		timeWhite--;
		var time = formatTime(timeWhite);

		timerWhite.innerText = time;
	}
}

function blkCountdown() {
	blackTimer = setInterval(blkTicker, 1000);
}
function whtCountdown() {
	whiteTimer = setInterval(whtTicker, 1000);
}

function blackStop() {
	clearInterval(blackTimer);
}
function whiteStop() {
	clearInterval(whiteTimer);
}

function whiteTimerStart() {
	blackStop();
	whtCountdown();
}
function blackTimerStart() {
	whiteStop();
	blkCountdown();
}
