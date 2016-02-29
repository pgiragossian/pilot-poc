var path = require('path');

var paths = {};
paths.root = __dirname;
paths.nm = path.join(paths.root, 'node_modules');
paths.src = path.join(paths.root, 'src');

module.exports = {
	entry: {
		"app.js": path.join(paths.src, "app.js")
	},
	output: {
		path: 'www',
		filename: '[name]'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.scss$/, loader: "style!css!sass"},
			{ test: /\.js$/, loader:"babel?presets[]=es2015", exclude: [paths.nm]}
		]
	},
	resolve: {
		root: [paths.root],
		extensions: ['', '.js', '.scss'],
		moduleDirectories: [
			'bower_components',
			'node_modules',
			'src'
		],
		alias: {
			npm: 'node_modules',
			bower: 'bower_components'
		}
	}
};