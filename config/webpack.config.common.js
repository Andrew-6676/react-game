const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	entry: {
		index: {
		  import: './src/index.tsx',
		  dependOn: 'shared'
		},
		shared: 'lodash'
	},
	target: 'web',
	resolve: {
		// modules: [path.resolve(__dirname, './src'), 'node_modules'],
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							sassOptions: {
								outputStyle: 'compressed'
							}
						}
					}
				]
			},
			{
				test: /\.(ttf|woff|png|jpe?g|svg|gif)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					esModule: false
				}
			},
			{
				// include: path.resolve(__dirname, 'src/sound'),
				test: /\.(mp3|wav)$/,
				loader: 'file-loader',
			}
		]
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js'
	},
	devServer: {
		compress: true,
		open: true
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			favicon: './src/img/favicon.png',
			template: './src/index.ejs',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css'
		}),
		new CaseSensitivePathsPlugin()
	]
};
