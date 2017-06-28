var config = require('./webpack.config');
var path = require('path');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
var root = config.root;

root.devtool = 'cheap-module-eval-source-map';

// Uncomment the line below for testing CSP.
// root.devtool = 'source-map';

root.devServer = {
  host: '0.0.0.0',
  port: 1337,
  contentBase: 'example',
  publicPath: '/dist/',
  disableHostCheck: true,
  headers: { 'Cache-Control': 'no-cache, no-store' }
};

root.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(true)
  }),
  new webpack.WatchIgnorePlugin([
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './test/')
  ]),
  new webpack.LoaderOptionsPlugin({
    debug: true
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new DashboardPlugin()
];

module.exports = root;
