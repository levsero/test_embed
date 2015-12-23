var config = require('./webpack.config');
var webpack = require('webpack');

var defs = config.plugins[0].definitions;
defs.__DEV__ = false;
defs['process.env'] = {
  'NODE_ENV': JSON.stringify('production')
};

config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      'drop_console': true,
      'drop_debugger': true,
      'warnings': false
    }
  })
);

module.exports = config;
