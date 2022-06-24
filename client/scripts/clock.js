let whiteTimer,
	blackTimer,
	timeBlack = 150,
	timeWhite = 1350,
	increment = 3;

function blkTicker() {
	if (timeBlack > 0) {
		timeBlack--;
		timerBlack.innerText = formatTime(timeBlack);
	} else stopGame = true;
}
function whtTicker() {
	if (timeWhite > 0) {
		timeWhite--;
		timerWhite.innerText = formatTime(timeWhite);
	} else stopGame = true;
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
