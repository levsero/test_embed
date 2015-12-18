var config = require('./webpack.config');
var webpack = require('webpack');
var fs = require('fs');

var version = String(fs.readFileSync('dist/VERSION_HASH')).trim();
config.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(version),
    __DEV__: JSON.stringify(false),
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
