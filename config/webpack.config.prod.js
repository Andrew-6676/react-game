const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.config.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, '../build')
	},
	devServer: {
		contentBase: path.resolve(__dirname, '../build'),
		port: 8085
	},
	plugins: [
		// new BundleAnalyzerPlugin()
	]
});
