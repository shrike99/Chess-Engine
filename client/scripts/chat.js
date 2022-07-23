var messages = [],
	authors = [],
	lastMessage = '',
	lastAuthor = '',
	node = document.getElementById('message');

node.addEventListener('keyup', ({ key }) => {
	if (key === 'Enter') {
		socket.emit('chatMessage', node.value);
		logMessage(node.value, 'Me');
	}
});

function logMessage(str, name) {
	if (str === '') return;

	lastMessage = str;
	lastAuthor = `[${name}]`;

	//sets the chat box to be clear
	node.value = '';
	//adds the value of the chatbox to the array messages
	messages.push(lastMessage);
	authors.push(lastAuthor);
	//outputs the last few array elements of messages to html
	for (var i = 1; i < 14; i++) {
		if (messages[messages.length - i]) document.getElementById('chatlog' + i).innerHTML = messages[messages.length - i];
		if (authors[authors.length - i]) document.getElementById('chatName' + i).innerHTML = authors[authors.length - i];

		if (authors[authors.length - i] === '[Me]') document.getElementById('chatName' + i).style['color'] = '#FD4D4D';
		else document.getElementById('chatName' + i).style['color'] = 'white';
	}
}

socket.on('updateMessage', (msg, sender) => {
	if (sender.username === username) return;
	else logMessage(msg, sender.username);
});
