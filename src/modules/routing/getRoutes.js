let fs = require("flowfs");
let bluebird = require("bluebird");

/*
routes are automatically loaded from the routes dir

dirs can have their own routers, in router.js, in which case only that file
is loaded by the current call to getRoutes, and is responsible for loading
its entire sub-tree.

it can be a sibling of its top-level sub-routes -- getRoutes knows not to
just give it back itself for getRoutes(__dirname) even though it's called
router.js, because of the "inSubDir" flag.

we also skip any dirs called "modules" etc so that we can have non-route code
in the routes dir

NOTE the app and router.js must await if async, as the order of handlers is
important (e.g. 404 is usually just a catch-all handler that gets added
after everything else and returns a 404 unconditionally)
*/

let skipDirs = [
	"modules",
	"middleware",
];

async function getRoutes(dir, inSubDir=false) {
	dir = fs(dir);
	
	let routes = [];
	let router = dir.child("router.js");
	
	if (inSubDir && await router.exists()) {
		routes.push(router);
	} else {
		let files = (await dir.lsFiles()).filter(node => node.name !== "router.js");
		let dirs = (await dir.lsDirs()).filter(node => !skipDirs.includes(node.name));
		
		routes = routes.concat(
			files,
			...(await bluebird.map(dirs, dir => getRoutes(dir, true))),
		);
	}
	
	return routes;
}

module.exports = getRoutes;
