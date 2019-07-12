const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const fs = require('fs')

module.exports = () => {
  const config = JSON.parse(fs.readFileSync('./e2e/fixtures/account-config/z3nwebwidget2019.json'))

  return merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    devServer: {
      host: '0.0.0.0',
      port: 5000,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store'
      }
    },
    plugins: [
      ...webWidgetTemplates(config),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true)
      }),
      new webpack.WatchIgnorePlugin([
        path.resolve(__dirname, './test/'),
        path.resolve(__dirname, './node_modules/')
      ])
    ]
  })
}
