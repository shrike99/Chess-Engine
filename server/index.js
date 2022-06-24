const io = require('socket.io')(3000, {
	cors: {
		origin: ['http://127.0.0.1:5500'],
	},
});

const players = [];

io.on('connection', (socket) => {
	players.push(socket.id);
	console.log(players + '\n');

	socket.on('request-players', () => {
		io.to(socket.id).emit('player-list', players);
	});

	socket.on('found-player', (id) => {
		socket.playerID = id;
	});

	socket.on('move', (move) => {
		io.to(socket.playerID).emit('move');
	});

	socket.on('disconnect', (socket) => {
		players.splice(players.indexOf(socket.id), 1);
	});
});
