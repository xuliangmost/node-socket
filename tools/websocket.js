const MySocket = function (host) {
	const that = this;
	this.sockets = new WebSocket("ws://" + host);
	this.Action = {
		on: function (fnName, callBack) {
			this[fnName] = callBack
		},
		emit: function (fnName, argumets) {
			this[fnName] && this[fnName](argumets)
		}
	};
	this.on = function (fnName, callBack) {
		this.Action.on(fnName, callBack)
	};
	this.sockets.onmessage = function (message) {
		const msg = JSON.parse(message.data);
		const {type, data} = msg;
		if (that.Action[type]) {
			that.Action.emit(type, data)
		}
	};
	this.emit = function (params = {}) {
		this.sockets.send(JSON.stringify(params))
	}
};
window.MySocket = MySocket;