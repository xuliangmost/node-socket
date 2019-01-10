function startSocket () {
	const WebSocket = require('ws');
	const url = require('url');
// 引用Server类:
	const WebSocketServer = WebSocket.Server;

// 实例化:
	var wbSocketUsers = {};
	const wss = new WebSocketServer({
		port: 3000,
		verifyClient: function (info, callBack) {
			const flag = !!url.parse(info.req.url, true).query.uuid && !wbSocketUsers[url.parse(info.req.url, true).query.uuid];
			callBack(flag, flag ? 200 : 403);
		}
	});

	wss.broadcast = function (params, type, nowUser = '') {
		let users = Object.assign({}, wbSocketUsers);
		delete users[nowUser];
		Object.keys(users).forEach(function (item) {
			users[item].send(`${JSON.stringify({type: type, data: params})}`, function (err) {
				err && console.log(`Error:---`, err);
			});
		});
	};

	wss.on('connection', function (socket, request) {

		// socket.emit('aaa') 客户端接受就用 on('aaa')
		const nowUser = url.parse(request.url, true).query.uuid;
		wbSocketUsers[nowUser] = socket;
		this.broadcast(nowUser, 'otherConnect');
		socket.on('message', function (data) {
			try {
				data = JSON.parse(data);
			} catch (e) {
				data = {}
			}
			const {to, message, type, from} = data; //这是要发送的人
			wss.broadcast({message, from, to}, type, nowUser)
			/*if (wbSocketUsers[to]) { //先不做点对点发
				wbSocketUsers[to].send(JSON.stringify({
					data: message,
					type
				}))
			}*/
		});
		socket.on('close', function (data) {
			if (nowUser) {
				delete wbSocketUsers[nowUser];
			}
			if (Object.keys(wbSocketUsers).length > 0) {
				wss.broadcast(nowUser, 'otherDisConnect');
			}
		});
	});
}

module.exports = startSocket;