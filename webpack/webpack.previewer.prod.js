const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const I18nPlugin = require('./i18nPlugin.js')
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
    publicPath: process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest/'
  },
  plugins: [
    I18nPlugin(false),
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
