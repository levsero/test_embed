const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const common = require('./webpack.common.js')

const classicRoot = path.resolve(__dirname, '../', '../', 'web-widget-classic')

module.exports = merge(common, {
  mode: 'production',
  entry: {
    webWidgetPreview: path.join(classicRoot, '/classicSrc/webWidgetPreview.js'),
    chatPreview: path.join(classicRoot, '/classicSrc/chatPreview.js'),
  },
  output: {
    chunkFilename: '[name].[chunkhash].js',
    publicPath: process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest/',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
    new BundleAnalyzerPlugin({
      reportFilename: '../report.html',
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
})
