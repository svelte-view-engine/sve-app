let merge = require("lodash.merge");
let yargs = require("yargs");
let fs = require("fs");
let defaultConfig = require("./defaultConfig");

// default config

let config = defaultConfig();

// env file

if (fs.existsSync(__dirname + "/env.js")) {
	merge(config, require("./env.js"));
}

// environment variables (note - doesn't support nested props)

let fromEnv = [
	"PORT",
];

for (let k of fromEnv) {
	if (k in process.env) {
		config[k.toLowerCase().replace(/_(\w)/g, (_, c) => c.toUpperCase())] = process.env[k];
	}
}

// command line args

let {argv} = yargs;

if (argv.config) {
	merge(config, argv.config);
}

module.exports = config;
