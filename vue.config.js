const webpack = require('webpack');
var path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	configureWebpack: {
		devtool: 'source-map',
		resolve: {
			extensions: ['.js', '.vue', '.json'],
			alias: {
				'@': resolve('src')
			}
		}
	},
	runtimeCompiler: true
}