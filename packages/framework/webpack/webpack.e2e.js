const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const projectRoot = path.resolve(__dirname, '../')

module.exports = () => {
  const templatesOptions = {
    templatesFilter: file => file === 'e2e.html'
  }
  const config = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../e2e/fixtures/account-config/z3nwebwidget2019.json'))
  )

  return merge(common, {
    optimization: {
      runtimeChunk: 'single'
    },
    mode: 'production',
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    entry: {
      webWidgetPreview: path.join(projectRoot, '/src/webWidgetPreview.js'),
      chatPreview: path.join(projectRoot, '/src/chatPreview.js')
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
        chunks: ['runtime', 'i18n_locale_bundle', 'webWidgetPreview']
      }),
      new HtmlWebpackPlugin({
        filename: 'chatPreview.html',
        chunks: ['runtime', 'i18n_locale_bundle', 'chatPreview']
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
