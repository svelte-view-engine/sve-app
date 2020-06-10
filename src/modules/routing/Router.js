let express = require("express");
let expressAsyncWrap = require("./expressAsyncWrap");
let ajaxWrap = require("./ajaxWrap");

module.exports = function(app) {
	let router = express.Router();
	
	expressAsyncWrap(router);
	ajaxWrap(router);
	
	router.app = app;
	
	return router;
}
