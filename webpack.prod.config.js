var config = require('./webpack.config');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var root = config.root;

root.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(false),
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true
    },
    compress: {
      drop_debugger: true,
      warnings: false,
      screw_ie8: true
    },
    comments: false
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
];

module.exports = root;
