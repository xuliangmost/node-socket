const http = require('http');

const startSocket = require('./script/socketServer');

const open = require('open');
const tools = require('./script/method');


const HOST = process.env.HOST || '0.0.0.0';
const server = http.createServer(tools.serverCreate);

startSocket();

server.on('request', function (req, res) {
	if (req.url === '/') {
		// 通过响应头来实现服务端重定向
		res.writeHead(302, {
			'Location': 'http://10.235.204.181:8080/static/index.html'
		});
		res.end();
	}
	/*else if (req.url === '/') {
		fs.readFile(path.join(__dirname, '/static/index.html'), function (err, data) {
			if (err) {
				throw err;
			}
			res.end(data)
		})
	}*/
});
server.listen(8080, HOST);

// open(`http://localhost:8080`);

console.log(`Server is running at http://${getIPAdress()}:8080`);


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
