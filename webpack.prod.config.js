var config = require('./webpack.config');
var webpack = require('webpack');

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      'drop_console': true,
      'drop_debugger': true,
      'warnings': false
    }
  })
];

module.exports = config;
