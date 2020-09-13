let http = require("http");
let express = require("express");
let svelteViewEngine = require("svelte-view-engine");

let app = express();

app.enable("trust proxy");

let root = __dirname + "/..";

let config = {
	template: `${root}/src/template.html`,
	dir: `${root}/src/pages`,
	type: "html",
	buildScript: `${root}/scripts/svelte/build.js`,
	buildDir: `${root}/build/pages`,
	init: true,
	watch: true,
	liveReload: true,
	transpile: true,
	minify: true,
	clientCss: true,
	assetsPrefix: "/assets/",
	dev: true,
};

let engine = svelteViewEngine(config);

app.engine(config.type, engine.render);
app.set("view engine", config.type);
app.set("views", config.dir);

app.use("/assets", express.static(config.buildDir));

app.get("/", function(req, res) {
	res.render("Index", {
		a: 1,
		b: 2,
	});
});

http.createServer(app).listen(3000);
