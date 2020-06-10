let sleep = require("./src/utils/sleep");
let chokidar = require("chokidar");

/*
watch changes for dev

was using pm2 for this but with files that trigger both an app restart and
a page rebuild(s), we need to wait for the page rebuilds before restarting,
otherwise the restart interrupts the page rebuild
*/

module.exports = function(engine) {
	let watcher = chokidar.watch([
		"../watch.js",
		"../config",
		"core",
		"middleware",
		"modules",
		"routes",
		"utils",
		"app.js",
		"main.js",
	].map(p => __dirname + "/src/" + p));
	
	watcher.on("change", async function(path) {
		console.log("Change: " + path);
		console.log("Sleeping for 250ms to allow page rebuilds to begin");
		
		await sleep(250);
		
		console.log("Awaiting page rebuilds");
		
		await engine.awaitPendingBuilds();
		
		console.log("Exiting for restart");
		
		process.exit();
	});
}
