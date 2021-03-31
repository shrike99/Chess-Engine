var whiteTimer;
var blackTimer;

var timeBlack = 300
var timeWhite = 300
var increment = 3


function blkTicker() {
    timeBlack--
    var time = formatTime(timeBlack)

    timerBlack.innerText = time
}
function whtTicker() {
    timeWhite--
    var time = formatTime(timeWhite)

    timerWhite.innerText = time
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
};