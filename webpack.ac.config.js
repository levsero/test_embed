var config = require('./webpack.prod.config');
var path = require('path');
var prefix = process.cwd();

config.entry = { main: path.join(prefix, '/src/main.js') };

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_'
};

module.exports = config;
