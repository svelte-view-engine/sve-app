module.exports = function(app) {
	app.all("/", async function(req, res) {
		res.render("Index", {
			a: 1,
			b: 2,
		});
	});
}
