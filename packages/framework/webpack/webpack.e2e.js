const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

const classicRoot = path.resolve(__dirname, '../', '../', 'web-widget-classic')

const MESSENGER_ENDPOINT = 'http://localhost:1339/dist/web-widget-messenger.js'
const CLASSIC_ENDPOINT = 'http://localhost:1336/dist/web-widget-classic.js'

module.exports = () => {
  const templatesOptions = {
    templatesFilter: (file) => file === 'e2e.html',
  }
  const config = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../e2e/fixtures/account-config/z3nwebwidget2019.json'))
  )

  return merge(common, {
    optimization: {
      runtimeChunk: 'single',
    },
    mode: 'production',
    output: {
      filename: '[name].js',
      publicPath: '/',
    },
    entry: {
      webWidgetPreview: path.join(classicRoot, '/classicSrc/webWidgetPreview.js'),
      chatPreview: path.join(classicRoot, '/classicSrc/chatPreview.js'),
    },
    devServer: {
      host: 'localhost',
      hot: false,
      inline: false,
      port: 5123,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'webWidgetPreview.html',
        chunks: ['runtime', 'i18n_locale_bundle', 'webWidgetPreview'],
      }),
      new HtmlWebpackPlugin({
        filename: 'chatPreview.html',
        chunks: ['runtime', 'i18n_locale_bundle', 'chatPreview'],
      }),
      ...webWidgetTemplates(config, templatesOptions),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        __CLASSIC_ENDPOINT__: JSON.stringify(CLASSIC_ENDPOINT),
        __MESSENGER_ENDPOINT__: JSON.stringify(MESSENGER_ENDPOINT),
      }),
      new webpack.NormalModuleReplacementPlugin(/loadZChat\.js/, './loadZChat.e2e.js'),
      new webpack.WatchIgnorePlugin({
        paths: [path.resolve(__dirname, './test/'), path.resolve(__dirname, './node_modules/')],
      }),
      new ModuleFederationPlugin({
        name: 'framework',
      }),
    ],
  })
}
