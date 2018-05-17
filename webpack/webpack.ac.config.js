var config = require('./webpack.prod.config');
var externals = require('./externals');
var path = require('path');
var prefix = process.cwd();

config.entry = { 'web_widget': path.join(prefix, '/src/main.js') };
config.externals = externals;

module.exports = config;
