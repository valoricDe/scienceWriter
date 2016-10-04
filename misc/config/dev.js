const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (paths, server, html) => {
	return {
		devtool: 'source-map',
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin(html),
			new CopyWebpackPlugin([
				{ from: 'vendor', to: 'vendor' },
				{ from: './node_modules/tinymce/plugins', to: 'js/plugins' },
				{ from: './node_modules/tinymce/themes', to: 'js/themes' },
				{ from: './node_modules/tinymce/skins', to: 'js/skins' }
			])
		],
		devServer: {
			host: server.host,
			port: server.port,
			inline: true,
			contentBase: paths.build.path,
		},
	};
};