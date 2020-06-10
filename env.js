let {
	HOME,
} = process.env;

/*
per-environment config, would usually not be in repo	
*/

module.exports = {
	env: "dev",
	watch: true,
	port: 3000,
	svelte: {
		init: true,
		watch: true,
		liveReload: true,
		transpile: false,
		minify: false,
		clientCss: true,
		rebuildOnRenderError: true,
		renderBeforeInit: true,
		dev: true,
	},
};
