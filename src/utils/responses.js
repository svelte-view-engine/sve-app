module.exports = {
	notFound(res) {
		res.status(404);
		res.render("error/404");
	},
};
