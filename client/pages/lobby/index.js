function createElement(element, attribute, inner) {
	if (typeof element === 'undefined') {
		return false;
	}
	if (typeof inner === 'undefined') {
		inner = '';
	}
	var el = document.createElement(element);
	if (typeof attribute === 'object') {
		for (var key in attribute) {
			el.setAttribute(key, attribute[key]);
		}
	}
	if (!Array.isArray(inner)) {
		inner = [inner];
	}
	for (var k = 0; k < inner.length; k++) {
		if (inner[k].tagName) {
			el.appendChild(inner[k]);
		} else {
			el.appendChild(document.createTextNode(inner[k]));
		}
	}
	return el;
}

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
