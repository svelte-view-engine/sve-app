let root = __dirname;

module.exports = function() {
	return {
		env: "prod",
		port: 3000,
		
		svelte: {
			template: `${root}/src/template.html`,
			dir: `${root}/src/pages`,
			type: "html",
			buildScript: `${root}/scripts/svelte/build.js`,
			buildDir: `${root}/build/pages`,
			watch: false,
			transpile: true,
			minify: true,
			clientCss: false,
			assetsPrefix: "/assets/",
			dev: false,
			init: true,
		},
	};
}
