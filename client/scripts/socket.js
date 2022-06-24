const socket = io('http://localhost:3000');

socket.on('connect', () => {
	console.log(socket.id);
});

const playerID = '1';

socket.emit('found-player', playerID);

socket.emit('move');

socket.on('move', (move) => {});

socket.emit('request-players');

socket.on('player-list', (list) => {});
