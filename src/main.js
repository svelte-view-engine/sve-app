let http = require("http");
let app = require("./app");
let config = require("../config");

(async function() {
	http.createServer(await app()).listen(config.port);
})();
