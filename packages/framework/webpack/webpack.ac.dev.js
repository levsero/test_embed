const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const { execSync } = require('child_process')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const common = require('./webpack.ac.common.js')
const webWidgetTemplates = require('../dev/web_widget_templates')
const previewTemplates = require('../dev/preview_templates')
const runDashboard = require('./runDashboard')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

const projectRoot = path.resolve(__dirname, '../')
const CSP_HEADER =
  "\
  object-src 'none';\
  script-src 'nonce-abc123' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;\
  base-uri 'none'\
"
const WEBPACK_OUTPUT_PUBLIC_PATH =
  process.env.WEBPACK_OUTPUT_PUBLIC_PATH || 'http://localhost:1337/'
// Default to true if WEBPACK_DEV_SERVER_DISABLE_HOST_CHECK is not set
const WEBPACK_DEV_SERVER_DISABLE_HOST_CHECK =
  process.env.WEBPACK_DEV_SERVER_DISABLE_HOST_CHECK !== 'false'
const WEBPACK_DEV_SERVER_HOST = process.env.WEBPACK_DEV_SERVER_HOST || '127.0.0.1'
const WEBPACK_DEV_SERVER_INJECT_CLIENT = process.env.WEBPACK_DEV_SERVER_INJECT_CLIENT

const VERSION = execSync(
  `cat ${path.resolve(__dirname, '../../../REVISION')} || git rev-parse --short HEAD`
)
  .toString()
  .trim()

const MESSENGER_ENDPOINT = `http://localhost:1339/dist/web-widget-messenger-${VERSION}.js`
const CLASSIC_ENDPOINT = `http://localhost:1336/dist/web-widget-classic-${VERSION}.js`

module.exports = () => {
  const userConfig = process.env.USER_CONFIG || 'example-template'

  const config = require(path.join(projectRoot, `/dev/configs/${userConfig}`))

  const webpackConfig = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      publicPath: WEBPACK_OUTPUT_PUBLIC_PATH,
    },
    target: ['web', 'es5'],
    optimization: {
      runtimeChunk: 'single',
    },
    devServer: {
      host: WEBPACK_DEV_SERVER_HOST,
      port: 1337,
      disableHostCheck: WEBPACK_DEV_SERVER_DISABLE_HOST_CHECK,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Security-Policy': CSP_HEADER,
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/web_widget/latest': {
          target: WEBPACK_OUTPUT_PUBLIC_PATH,
          pathRewrite: { '^/web_widget/latest': '' },
        },
        [`/web_widget/${VERSION}`]: {
          target: WEBPACK_OUTPUT_PUBLIC_PATH,
          pathRewrite: { [`^/web_widget/${VERSION}`]: '' },
        },
      },
      allowedHosts: ['.zendesk-dev.com', '.zd-dev.com'],
      injectClient: WEBPACK_DEV_SERVER_INJECT_CLIENT,
    },
    plugins: [
      ...webWidgetTemplates(config),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
        __MESSENGER_ENDPOINT__: JSON.stringify(MESSENGER_ENDPOINT),
        __CLASSIC_ENDPOINT__: JSON.stringify(CLASSIC_ENDPOINT),
      }),
      new webpack.WatchIgnorePlugin({
        paths: [path.resolve(__dirname, './test/'), path.resolve(__dirname, './node_modules/')],
      }),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false,
      }),
      new ModuleFederationPlugin({
        name: 'framework',
      }),
    ],
  })

  if (WEBPACK_DEV_SERVER_INJECT_CLIENT) {
    webpackConfig.devServer.injectClient = WEBPACK_DEV_SERVER_INJECT_CLIENT === 'true'
  }

  if (process.env.LAZY_DASHBOARD === 'true') {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@zendesk/conversation-components': path.join(projectRoot, '../conversation-components/src'),
      '@zendesk/sunco-js-client': path.join(projectRoot, '../sunco-js-client/src'),
      '@zendesk/widget-shared-services': path.join(projectRoot, '../shared-services/src'),
    }

    webpackConfig.module.rules.push(
      {
        test: /\.js$/,
        include: path.resolve(projectRoot, '../conversation-components'),
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(projectRoot, '../conversation-components/.babelrc.js'),
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(projectRoot, '../sunco-js-client'),
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(projectRoot, '../sunco-js-client/.babelrc.js'),
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(projectRoot, '../shared-services'),
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(projectRoot, '../shared-services/.babelrc.js'),
        },
      }
    )
  }

  if (process.env.USE_DASHBOARD === 'true') {
    webpackConfig.entry = {
      framework: path.join(projectRoot, '/src/framework/index.js'),
      webWidgetPreview: path.join(
        projectRoot,
        '../web-widget-classic/classicSrc/webWidgetPreview.js'
      ),
      chatPreview: path.join(projectRoot, '../web-widget-classic/classicSrc/chatPreview.js'),
    }
    webpackConfig.plugins.push(...previewTemplates())
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin()
    )
    webpackConfig.target = 'web'
    webpackConfig.devServer.hot = true
    const useFederatedWidgets = process.env.USE_MODULE_FEDERATION
    runDashboard(useFederatedWidgets)
  }

  return webpackConfig
}
