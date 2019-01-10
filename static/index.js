var ws;
const domMessage = $('.message');
const domLeft = $('.left');
$('.connect').click(function () {
	if (ws) {
		return false
	}
	const val = $('.username').val();
	const host = window.location.hostname + ":3000?uuid=" + val;
	// ws = new WebSocket(host);

	ws = new MySocket(host);
	ws.on('otherConnect', function (user) {
		$('.connect').text('connected');
		const line_message = document.createElement('p');
		line_message.innerText = user + ' 已上线';
		$('.right').append(line_message);
		/*ws.emit({
			to: user[i],
			message: domMessage.val(),
			type: 'message',
		})*/
	});
	ws.on('message', function (data) {
		const message = '<p class="other"><span>' + data.from + ':</span>' + data.message + '</p>';
		domLeft.append('<li>' + message + '</li>');
		domMessage.val('');
		domLeft.scrollTop(1000000000);
	});
	ws.on('otherDisConnect', function (user) {
		const line_message = document.createElement('p');
		line_message.innerText = user + '已下线';
		$('.right').append(line_message);
	})
});

$('.send').click(function () {
	send();
});
domMessage.on('keydown', function (e) {
	if (e.keyCode === 13) {
		send();
	}
});

function send () {
	if (!ws) {
		alert('请先连接聊天室');
		return false
	}
	const value = domMessage.val();
	if (!value) {
		alert('内容不能空');
		return false
	}
	ws.emit({
		to: '',
		message: value,
		type: 'message',
		from: $('.username').val()
	});
	const message = '<p class="me">' + value + '<span>:我 </span></p>';
	domLeft.append('<li>' + message + '</li>');
	domMessage.val('');
	domLeft.scrollTop(1000000000);
}