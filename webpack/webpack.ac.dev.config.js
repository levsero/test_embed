var config = require('./webpack.dev.config');
var externals = require('./externals');
var path = require('path');
var prefix = process.cwd();

config.entry = { 'web_widget': path.join(prefix, '/src/main.js') };
config.externals = externals;

config.devServer.contentBase = ['example', './'];
config.devServer.publicPath = '/dist/web_widget/ffffff/';

module.exports = config;
