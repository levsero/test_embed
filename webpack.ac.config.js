var config = require('./webpack.prod.config');

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_'
};

module.exports = config;
