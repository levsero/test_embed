const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const legalNotices =
  'Our embeddable contains third-party, open source software and/or libraries. ' +
  'To view them and their license terms, go to http://goto.zendesk.com/embeddable-legal-notices'

const WEBPACK_JSONP_GLOBAL = 'zEWebpackJsonp'
const DEV = 'development'
const PROD = 'production'
const assetBasePath = process.env.STATIC_ASSETS_DOMAIN || 'https://static.zdassets.com'
const embeddableEnv = process.env.EMBEDDABLE_FRAMEWORK_ENV || process.env.NODE_ENV || DEV

const prefix = process.cwd()
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const cssModulesName = embeddableEnv === DEV ? '[path][name]-[local]' : '[local]-[hash:base64:5]'

const babelLoaderPlugins =
  embeddableEnv === PROD ? [['react-remove-properties', { properties: ['data-testid'] }]] : []

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist/public'),
    publicPath: '/dist/',
    filename: '[name].js',
    jsonpFunction: WEBPACK_JSONP_GLOBAL
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: babelLoaderPlugins
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: cssModulesName
              }
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              data: `$asset-base-path: "${assetBasePath}";`
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      { test: /lodash/, loader: 'imports-loader?define=>false' },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false },
                  { convertStyleToAttrs: false },
                  { removeViewBox: false },
                  { prefixIds: false },
                  { cleanupIDs: false },
                  { inlineStyles: false }
                ]
              },
              titleProp: true
            }
          }
        ]
      },
      {
        test: /\.(yml|yaml)/,
        use: ['json-loader', 'yaml-loader']
      }
    ]
  },
  resolve: {
    alias: {
      // Framework
      component: path.join(prefix + '/src/component'),
      components: path.join(prefix + '/src/components'),
      constants: path.join(prefix + '/src/constants'),
      embed: path.join(prefix + '/src/embed'),
      embeds: path.join(prefix + '/src/embeds'),
      errors: path.join(prefix + '/src/errors'),
      mixin: path.join(prefix + '/src/component/mixin'),
      service: path.join(prefix + '/src/service'),
      src: path.join(prefix + '/src'),
      utility: path.join(prefix + '/src/util'),
      translation: path.join(prefix + '/src/translation'),
      types: path.join(prefix + '/src/types'),
      vendor: path.join(prefix + '/src/vendor'),
      // CSS Components
      componentCSS: path.join(prefix + '/src/styles/components'),
      icons: path.join(prefix + '/src/asset/icons'),
      globalCSS: path.join(prefix + '/src/styles/globals.scss')
    },
    extensions: ['.js'],
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __EMBEDDABLE_FRAMEWORK_ENV__: JSON.stringify(embeddableEnv),
      __ASSET_BASE_PATH__: JSON.stringify(assetBasePath)
    }),
    new webpack.BannerPlugin({
      banner: legalNotices
    })
  ]
}
