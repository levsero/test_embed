const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const common = require('./webpack.common.js')
const previewTemplates = require('../dev/preview_templates')

const classicRoot = path.resolve(__dirname, '../', '../', 'web-widget-classic')

module.exports = merge(common, {
  mode: 'development',
  entry: {
    webWidgetPreview: path.join(classicRoot, '/classicSrc/webWidgetPreview.js'),
    chatPreview: path.join(classicRoot, '/classicSrc/chatPreview.js'),
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /chat-web-sdk/,
        use: 'source-map-loader',
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 1337,
    disableHostCheck: true,
    headers: { 'Cache-Control': 'no-cache, no-store' },
  },
  plugins: [
    ...previewTemplates(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new webpack.WatchIgnorePlugin({
      paths: [path.resolve(__dirname, './node_modules/'), path.resolve(__dirname, './test/')],
    }),
    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    }),
  ],
})
