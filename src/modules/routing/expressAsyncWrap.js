let _typeof = require("../../utils/typeof");

/*
overwrite app.get() etc to automatically wrap async handlers with
error handling

we don't wrap error handlers (4-param handlers)
*/

function wrap(handler) {
	return async function(req, res, next) {
		let nextCalled = false;
		
		try {
			await handler(req, res, function(...args) {
				next(...args);
				
				nextCalled = true;
			});
		} catch (e) {
			if (!res.headersSent && !nextCalled) {
				next(e);
			}
		}
	}
}

function wrapArgs(val) {
	if (_typeof(val) === "AsyncFunction" && val.length !== 4) {
		return wrap(val);
	} else {
		return val;
	}
}

module.exports = function(app) {
	let methods = {
		get: app.get,
		post: app.post,
		all: app.all,
		use: app.use,
	};
	
	for (let m in methods) {
		app[m] = function(...args) {
			methods[m].apply(app, args.map(wrapArgs));
		}
	}
}
