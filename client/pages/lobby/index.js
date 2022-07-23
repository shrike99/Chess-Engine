var players = [];

socket.emit('request-players');

socket.on('player-list', (list) => {
	list.splice(list.indexOf(socket.id), 1);
	players = list;
});

function Join() {
	setCookie('playerID', players[0], 1);
	document.location = 'http://127.0.0.1:5500/client/';
	socket.emit('found-player', players[0]);
}
