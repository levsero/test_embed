var config = require('./webpack.prod.config');
var path = require('path');
var prefix = process.cwd();
var Visualizer = require('webpack-visualizer-plugin');

config.entry = { widget: path.join(prefix, '/src/main.js') };

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_',
  superagent: 'superagent'
};

config.plugins.pop();
config.plugins.push(new Visualizer({ filename: 'ac-stats.html' }));

module.exports = config;
