const path = require('path');
const root = path.resolve(process.argv[2] || '.');
const url = require('url');
const fs = require('fs');
const serverCreate = function (request, response) {
	// 获得URL的path，类似 '/css/bootstrap.css':
	const pathname = url.parse(request.url).pathname;
	// 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
	let headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = true;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

	const filepath = path.join(root, pathname);
	// 获取文件状态:
	fs.stat(filepath, function (err, stats) {
		if (!err && stats.isFile()) {
			// 没有出错并且文件存在:
			response.writeHead(200, headers);
			// 将文件流导向response:
			fs.createReadStream(filepath).pipe(response);
		}
	});
};

module.exports={serverCreate};