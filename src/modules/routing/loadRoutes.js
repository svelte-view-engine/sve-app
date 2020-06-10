let bluebird = require("bluebird");
let getRoutes = require("./getRoutes");

module.exports = async function(dir, app, core, db) {
	await bluebird.map(getRoutes(dir), function(route) {
		return require(route.path)(app, core, db);
	});
}
