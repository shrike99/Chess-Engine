const socket = io('http://localhost:3000'),
	username = getCookie('username') ?? 'Messi';

socket.on('connect', () => {
	socket.emit('join', username, `test`);
});
