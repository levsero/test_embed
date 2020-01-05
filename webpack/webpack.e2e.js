const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const fs = require('fs')
const CWD = process.cwd()
const HtmlWebpackPlugin = require('html-webpack-plugin')
const chunks = require('./chunks')

module.exports = () => {
  const templatesOptions = {
    templatesFilter: file => file === 'e2e.html'
  }
  const config = JSON.parse(fs.readFileSync('./e2e/fixtures/account-config/z3nwebwidget2019.json'))
  const previewChunks = [chunks.RUNTIME_CHUNK, chunks.COMMON_VENDOR_CHUNK]

  return merge(common, {
    mode: 'development',
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    entry: {
      webWidgetPreview: path.join(CWD, '/src/webWidgetPreview.js'),
      chatPreview: path.join(CWD, '/src/chatPreview.js')
    },
    devServer: {
      host: '0.0.0.0',
      hot: false,
      inline: false,
      port: 5123,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'webWidgetPreview.html',
        chunks: previewChunks.concat('webWidgetPreview')
      }),
      new HtmlWebpackPlugin({
        filename: 'chatPreview.html',
        chunks: previewChunks.concat('chatPreview')
      }),
      ...webWidgetTemplates(config, templatesOptions),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false)
      }),
      new webpack.NormalModuleReplacementPlugin(/loadZChat\.js/, './loadZChat.e2e.js'),
      new webpack.WatchIgnorePlugin([
        path.resolve(__dirname, './test/'),
        path.resolve(__dirname, './node_modules/')
      ])
    ]
  })
}
