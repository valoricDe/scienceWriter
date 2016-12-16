const path = require('path');

const project = {
	title: 'scienceWriter', // your awesome app title
	root: 'root', // root where your react app will be rendered
};

const paths = {
	misc: __dirname,
	scripts: {
		path: path.join(__dirname, '../source/scripts'),
		file: 'index.tsx',
	},
	styles: {
		path: path.join(__dirname, '../source/styles'),
		file: 'index.scss',
	},
	build: {
		path: path.join(__dirname, '../build'),
		files: {
			script: 'js/bundle.js',
			style: 'css/style.css',
		},
	},
};

const server = {
	host: 'localhost',
	port: 8080,
};

const html = {
	title: project.title,
	favicon: path.join(paths.misc, 'favicon.ico'),
	template: path.join(paths.misc, 'template.ejs'),
	inject: 'body',
	root: project.root,
};

module.exports.project = project;
module.exports.paths = paths;
module.exports.server = server;
module.exports.html = html;