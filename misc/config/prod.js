const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = html => {
	return {
		postcss: [
			autoprefixer({
				browsers: ['last 2 versions'],
			}),
		],
		plugins: [
			new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
				},
			}),
			new webpack.NormalModuleReplacementPlugin(
				/mobx-react-devtools/,
				'empty-module'
			),
			new webpack.NoErrorsPlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
				},
				output: {
					comments: false,
				},
			}),
			new HtmlWebpackPlugin(
				Object.assign(html, {
					minify: {
						collapseWhitespace: true,
					},
				})
			),
		],
	};
};