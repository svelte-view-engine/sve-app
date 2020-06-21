let fs = require("flowfs");
let buildSsr = require("./buildSsrComponent");
let buildDom = require("./buildDomComponent");

function readStream(stream) {
	stream.setEncoding("utf8");
	
	return new Promise(function(resolve, reject) {
		let res = "";
		
		stream.on("data", function(chunk) {
			res += chunk;
		});
		
		stream.on("end", function() {
			resolve(res);
		});
		
		stream.on("error", function(error) {
			reject(error);
		});
	});
}

(async function() {
	try {
		let {
			name,
			path,
			buildPath,
			options,
			useCache,
		} = JSON.parse(await readStream(process.stdin));
		
		let buildFile = fs(buildPath);
		let cache = {};
		
		if (useCache && await buildFile.exists()) {
			let {client, server} = await buildFile.readJson();
			
			cache.client = client.cache;
			cache.server = server.cache;
		}
		
		let server = await buildSsr(path, options, cache.server);
		let client = await buildDom(path, name, options, cache.client);
		
		await buildFile.parent.mkdirp();
		
		await buildFile.writeJson({
			server,
			client,
		});
	} catch (e) {
		console.error(e);
		
		process.exit(1);
	}
})();
