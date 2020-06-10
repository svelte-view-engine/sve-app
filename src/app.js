let config = require("../config");
let express = require("express");
let fs = require("flowfs");
let svelteViewEngine = require("svelte-view-engine");
let _typeof = require("./utils/typeof");
let {notFound} = require("./utils/responses");
let expressAsyncWrap = require("./modules/routing/expressAsyncWrap");
let loadRoutes = require("./modules/routing/loadRoutes");

module.exports = async function() {
	let app = express();
	
	expressAsyncWrap(app);

	app.enable("trust proxy");
	
	let engine = svelteViewEngine(config.svelte);

	let {
		dir,
		type,
	} = config.svelte;
	
	/*
	custom render function - the default one uses sync IO before caching,
	and the IO it does is unnecessary anyway.
	*/
	
	app.render = function(template, locals, callback) {
		if (_typeof(locals) === "Function") {
			callback = locals;
			locals = {};
		}
	
		locals = Object.assign({}, this.locals, locals._locals, locals);
		
		return engine.render(template, locals, callback);
	};
	
	app.renderEmail = function(template, locals) {
		locals = Object.assign({}, this.locals, locals);
		
		return engine.render(template, locals, null, true);
	}
	
	app._engine = engine;
	
	if (config.watch) {
		require("../watch")(engine);
	}
	
	/*
	rebuild the page on hard reload in Chrome
	
	svelte-view-engine checks the props for _rebuild and chrome sets
	cache-control to no-cache for hard reloads
	*/
	
	if (config.env === "dev") {
		app.use(function(req, res, next) {
			if (req.headers["cache-control"] === "no-cache") {
				res.locals._rebuild = true;
			}
			
			next();
		});
	}
	
	app.use("/assets", express.static(__dirname + "/../build/pages"));
	
	await loadRoutes(__dirname + "/routes", app);
	
	app.use(function(req, res) {
		notFound(res);
	});
	
	app.use(function(error, req, res, next) {
		console.error(error);
		
		res.status(500);
		
		res.render("error/500", {
			error,
		});
	});
	
	return app;
}
