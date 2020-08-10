const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const DashboardPlugin = require('./dashboard-plugin')
const previewTemplates = require('../dev/preview_templates')

const CWD = process.cwd()
const CSP_HEADER =
  "\
  object-src 'none';\
  script-src 'nonce-abc123' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;\
  base-uri 'none'\
"

module.exports = () => {
  const userConfig = process.env.USER_CONFIG || 'example-template'

  const config = require(path.join(CWD, `/dev/configs/${userConfig}`))

  const webpackConfig = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      publicPath: 'http://localhost:1337/'
    },
    devServer: {
      host: '127.0.0.1',
      port: 1337,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Security-Policy': CSP_HEADER,
        'Access-Control-Allow-Origin': '*'
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
      ]),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false
      })
    ]
  })

  if (process.env.USE_DASHBOARD === 'true') {
    webpackConfig.entry = {
      preload: path.join(CWD, '/src/preload.js'),
      webWidgetPreview: path.join(CWD, '/src/webWidgetPreview.js'),
      chatPreview: path.join(CWD, '/src/chatPreview.js')
    }
    webpackConfig.plugins.push(new DashboardPlugin(), ...previewTemplates())
  }

  return webpackConfig
}
