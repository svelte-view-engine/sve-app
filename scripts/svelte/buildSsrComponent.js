let fs = require("flowfs/mkdirp");
let rollup = require("rollup");
let svelte = require("rollup-plugin-svelte");
let resolve = require("rollup-plugin-node-resolve");
let commonjs = require("rollup-plugin-commonjs");
let sass = require("./sass");

module.exports = async function(path, options, cache) {
	let css;
	
	let inputOptions = {
		input: path,
		
		/*
		This reduces memory by ~30% by not bundling requires, but took some
		tweaking to get working so can be turned off if needed.
		
		This isn't so important with the latest svelte-view-engine and build
		script, as the memory footprint is about a tenth of what it was
		anyway
		*/
		
		external(id, parentId, resolved) {
			let file;
			let root = fs(__dirname).rel("../..");
			
			if (id.match(/^\./)) {
				file = fs(parentId).sibling(id);
			} else {
				file = root.child("node_modules").child(id);
			}
			
			let svelteDirs = [
				root.child("src/pages"),
				root.child("src/components"),
			];
			
			return svelteDirs.every(dir => !file.within(dir));
		},
		
		cache,
		
		plugins: [
			svelte({
				generate: "ssr",
				
				preprocess: {
					style: sass,
				},
				
				css(c) {
					css = c;
				},
				
				onwarn() {},
			
				dev: options.dev,
			}),
	
			resolve({
				browser: true,
			}),
			
			commonjs(),
		],
		
		onwarn(warning, next) {
			if (warning.code !== "UNUSED_EXTERNAL_IMPORT") {
				next(warning);
			}
		},
	};
	
	let outputOptions = {
		format: "cjs",
	};
	
	let bundle = await rollup.rollup(inputOptions);
	
	let {output} = await bundle.generate(outputOptions);
	
	return {
		cache: options.cache && bundle.cache,
		component: output[0].code,
		css,
	};
}
