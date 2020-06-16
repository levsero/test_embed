const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const common = require('./webpack.common.js')
const prefix = process.cwd()

module.exports = merge(common, {
  mode: 'production',
  entry: {
    webWidgetPreview: path.join(prefix, '/src/webWidgetPreview.js'),
    chatPreview: path.join(prefix, '/src/chatPreview.js')
  },
  output: {
    chunkFilename: '[name].[chunkhash].js',
    publicPath: process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest/'
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    new BundleAnalyzerPlugin({
      reportFilename: '../report.html',
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
})
