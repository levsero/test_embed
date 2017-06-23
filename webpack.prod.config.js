var _ = require('./node_modules/lodash');
var config = require('./webpack.config');
var webpack = require('webpack');
var Visualizer = require('webpack-visualizer-plugin');
var root = config.root;
var droppedFunctions = _.chain(console)
                        .keys()
                        .pull('warn', 'info')
                        .map(k => `console.${k}`)
                        .value();

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
      'pure_funcs': droppedFunctions,
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
