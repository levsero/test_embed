var config = require('./webpack.config');
var webpack = require('webpack');
var Visualizer = require('webpack-visualizer-plugin');
var root = config.root;

root.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(false),
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      'drop_console': true,
      'drop_debugger': true,
      'warnings': false
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new Visualizer()
];

module.exports = root;
