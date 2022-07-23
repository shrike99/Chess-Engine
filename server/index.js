const io = require('socket.io')(3000, {
	cors: {
		origin: ['http://127.0.0.1:5500'],
	},
});
const { userJoin, getPlayers, getCurrentUser } = require('./users');

io.on('connection', (socket) => {
	socket.on('join', (username, room) => {
		const user = userJoin(socket.id, username, room);

		console.log(JSON.stringify(user));

		socket.join(user.room);
	});

	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('updateMessage', msg, user);
	});
});
