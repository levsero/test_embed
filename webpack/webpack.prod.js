const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new OptimizeCSSAssetsPlugin({}),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
  ]
});
