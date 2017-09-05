var config = require('./webpack.dev.config');
var path = require('path');
var prefix = process.cwd();

config.entry = { 'web_widget': path.join(prefix, '/src/main.js') };

config.devServer.contentBase = ['example', './'];
config.devServer.publicPath = '/dist/web_widget/dev/';

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_',
  superagent: 'superagent'
};

module.exports = config;
