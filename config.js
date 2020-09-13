module.exports = {
	port: 3000,
	
	svelteViewEngine: {
		env: "dev",
		template: `${__dirname}/src/template.html`,
		dir: `${__dirname}/src/pages`,
		type: "html",
		buildDir: `${__dirname}/build/pages`,
		assetsPrefix: "/assets/",
	},
};
