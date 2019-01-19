const express = require('express');
const app = express();
const startSocket = require('./script/socketServer');

const open = require('open');
const HOST_ = `http://${getIPAdress()}:8080`;

app.use(express.static('./')).listen(8080);

startSocket();

open(`http://localhost:8080`);

console.log('You can now view zg in the browser.');
console.log(`Local:             http://localhost:8080/`);
console.log(`On Your Network:   ${HOST_}`);

function getIPAdress () {
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				return alias.address;
			}
		}
	}
}
