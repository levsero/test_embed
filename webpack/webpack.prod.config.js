var config = require('./webpack.config');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var root = config.root;

root.mode = 'production';

root.optimization = {
  minimizer: [
    new UglifyJSPlugin({
      uglifyOptions: {
        comments: false
      }
    })
  ]
}

root.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(config.version),
    __DEV__: JSON.stringify(false),
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
];

module.exports = root;
