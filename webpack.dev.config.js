var config = require('./webpack.config');
var path = require('path');
var webpack = require('webpack');

config.debug = true;
config.devtool = 'cheap-module-eval-source-map';

config.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(true)
  }),
  new webpack.WatchIgnorePlugin([
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './bower_components/'),
    path.resolve(__dirname, './test/')
  ]),
  new webpack.NoErrorsPlugin()
];

module.exports = config;
