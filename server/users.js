const players = [];

function userJoin(id, username, room) {
	const user = { id, username, room };

	players.push(user);

	return user;
}

function getPlayers() {
	return players;
}

function getCurrentUser(id) {
	return players.find((user) => user.id === id);
}

module.exports = {
	userJoin,
	getPlayers,
	getCurrentUser,
};
