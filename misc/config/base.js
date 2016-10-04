const path = require('path');
const webpack = require('webpack');
const WebpackNotifier = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (project, paths) => {
	return {
		entry: [
			path.join(paths.scripts.path, paths.scripts.file),
			path.join(paths.styles.path, paths.styles.file),
		],
		output: {
			path: paths.build.path,
			filename: paths.build.files.script,
			publicPath: '/',
		},
		resolve: {
			extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss'],
		},
		module: {
			loaders: [
				{
					test: /\.(tsx|ts)$/,
					exclude: /node_modules/,
					loaders: ['babel', 'ts'],
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass']),
				},
				{
					test: /\.(woff|woff2|eot|ttf)$/,
					loader: 'url?limit=100000&name=./css/fonts/font-[hash].[ext]',
				},
				{
					test: /\.(png|svg)$/,
					loader: 'url?limit=100000&name=./img/[ext]/img-[hash].[ext]',
				},
			],
		},
		plugins: [
			new ExtractTextPlugin(paths.build.files.style, {
				allChunks: true,
			}),
			new webpack.DefinePlugin({
				'process.env': {
					root: JSON.stringify(project.root),
				},
			}),
			new WebpackNotifier({
				title: project.title,
			}),
			new CopyWebpackPlugin([
				{ from: 'vendor/asciimath-tinymce4/plugin.js', to: 'js/vendor/asciimath-tinymce4/plugin.js' },
				{ from: 'vendor/TinyMCE-LocalAutoSave/localautosave/plugin.js', to: 'js/vendor/TinyMCE-LocalAutoSave/localautosave/plugin.js' },
				{ from: 'vendor/tinyMCE-mention/mention/plugin.js', to: 'js/vendor/tinyMCE-mention/mention/plugin.js' },
				{ from: './node_modules/tinymce/plugins', to: 'js/plugins' },
				{ from: './node_modules/tinymce/themes', to: 'js/themes' },
				{ from: './node_modules/tinymce/skins', to: 'js/skins' }
			]),
		],
	};
};
