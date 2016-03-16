var path = require('path'),
		webpack = require('webpack'),
		ExtractTextPlugin = require("extract-text-webpack-plugin");


var paths = {};
paths.root = __dirname;
paths.nm = path.join(paths.root, 'node_modules');
paths.src = path.join(paths.root, 'src');
paths.modules = path.join(paths.src, 'modules');

var env = 'dev';

if (process.argv.indexOf('--env=prod') >= 0) {
	env = 'prod';
}

var config = {
	entry: {
		"app.js": path.join(paths.src, "app.js")
	},
	output: {
		path: 'www',
		filename: '[name]'
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader:'babel?presets[]=es2015', exclude: [paths.nm]},
			{ test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader:'file'}
		]
	},
	resolve: {
		root: [paths.root],
		extensions: ['', '.js', '.scss', '.css'],
		moduleDirectories: [
			'bower_components',
			'node_modules',
			'src/modules'
		],
		alias: {
			npm: 'node_modules',
			bower: 'bower_components'
		}
	},
	plugins : []
};

switch(env) {
	case 'dev' :
		config.module.loaders.push({ test: /\.css$/, loader: "style!css" });
		config.module.loaders.push({ test: /\.scss$/, loader: "style!css!sass"});
		break;
	case 'prod' :
		config.module.loaders.push({ test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css')});
		config.module.loaders.push({ test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass')});
		config.plugins.push(new webpack.optimize.UglifyJsPlugin());
		config.plugins.push(new ExtractTextPlugin('style.css'));
		break;

}

module.exports = config;