var config = require('./webpack.prod.config');
var path = require('path');
var prefix = process.cwd();

config.entry = { 'web_widget': path.join(prefix, '/src/main.js') };

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_',
  superagent: 'superagent'
};

module.exports = config;
