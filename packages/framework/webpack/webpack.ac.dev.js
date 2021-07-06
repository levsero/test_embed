const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const { execSync } = require('child_process')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const DashboardPlugin = require('./dashboard-plugin')
const previewTemplates = require('../dev/preview_templates')

const projectRoot = path.resolve(__dirname, '../')
const CSP_HEADER =
  "\
  object-src 'none';\
  script-src 'nonce-abc123' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;\
  base-uri 'none'\
"
const PORT = 1337
const LOCAL_SERVER_URL = `http://127.0.0.1:${PORT}`
const PUBLIC_URL = process.env.STATIC_ASSETS_DOMAIN || LOCAL_SERVER_URL
const VERSION = execSync(
  `cat ${path.resolve(__dirname, '../../../REVISION')} || git rev-parse HEAD`
)
  .toString()
  .trim()

module.exports = () => {
  const userConfig = process.env.USER_CONFIG || 'example-template'

  const config = require(path.join(projectRoot, `/dev/configs/${userConfig}`))

  const webpackConfig = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      publicPath: `${PUBLIC_URL}/`,
    },
    devServer: {
      host: '0.0.0.0',
      port: PORT,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Security-Policy': CSP_HEADER,
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/web_widget/latest': {
          target: `${LOCAL_SERVER_URL}/`,
          pathRewrite: { '^/web_widget/latest': '' },
        },
        [`/web_widget/${VERSION}`]: {
          target: `${LOCAL_SERVER_URL}/`,
          pathRewrite: { [`^/web_widget/${VERSION}`]: '' },
        },
      },
      allowedHosts: ['.zendesk-dev.com', '.zd-dev.com'],
    },
    plugins: [
      ...webWidgetTemplates(config),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      }),
      new webpack.WatchIgnorePlugin([
        path.resolve(__dirname, './test/'),
        path.resolve(__dirname, './node_modules/'),
      ]),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false,
      }),
    ],
  })

  // Default to false unless set to true
  webpackConfig.devServer.injectClient = process.env.WEBPACK_DEV_SERVER_INJECT_CLIENT === 'true'

  if (process.env.USE_DASHBOARD === 'true') {
    webpackConfig.entry = {
      preload: path.join(projectRoot, '/src/framework/preload.js'),
      webWidgetPreview: path.join(projectRoot, '/src/webWidgetPreview.js'),
      chatPreview: path.join(projectRoot, '/src/chatPreview.js'),
    }
    webpackConfig.plugins.push(new DashboardPlugin(), ...previewTemplates())
  }

  return webpackConfig
}
