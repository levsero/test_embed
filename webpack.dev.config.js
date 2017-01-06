var config = require('./webpack.config');
var path = require('path');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');

config.debug = true;
config.devtool = 'cheap-module-eval-source-map';

config.devServer = {
  port: 1337,
  contentBase: path.join(__dirname, 'example'),
  publicPath: '/dist/'
};

config.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(true)
  }),
  new webpack.WatchIgnorePlugin([
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './test/')
  ]),
  new webpack.NoErrorsPlugin(),
  new DashboardPlugin()
];

module.exports = config;
