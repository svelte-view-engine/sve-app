let http = require("http");
let express = require("express");
let svelteViewEngine = require("svelte-view-engine");
let config = require("../config");

let app = express();
let engine = svelteViewEngine(config.svelteViewEngine);
let {dir, type, buildDir} = config.svelteViewEngine;

app.engine(type, engine.render);
app.set("view engine", type);
app.set("views", dir);

app.use("/assets", express.static(buildDir));

app.get("/", function(req, res, next) {
	res.render("Index", {
		a: 1,
		b: 2,
	});
});

http.Server(app).listen(config.port);
