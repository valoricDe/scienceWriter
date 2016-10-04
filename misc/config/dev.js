const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (paths, server, html) => {
	return {
		devtool: 'source-map',
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin(html),
		],
		devServer: {
			host: server.host,
			port: server.port,
			inline: true,
			contentBase: paths.build.path,
		},
	};
};