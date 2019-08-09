const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const I18nPlugin = require('./i18nPlugin.js')

const WEBPACK_JSONP_GLOBAL = 'zEWebpackJsonp'
const assetBasePath = process.env.STATIC_ASSETS_DOMAIN || 'https://static.zdassets.com'
const embeddableEnv = process.env.EMBEDDABLE_FRAMEWORK_ENV || process.env.NODE_ENV || 'development'

const prefix = process.cwd()
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const cssModulesName = embeddableEnv === 'production' ? '[hash:base64:5]' : '[path][name]-[local]'

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              localIdentName: cssModulesName,
              importLoaders: 2
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
        use: ['css-loader?importLoaders=1', 'postcss-loader']
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
  output: {
    path: path.join(prefix, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    jsonpFunction: WEBPACK_JSONP_GLOBAL
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
    I18nPlugin
  ]
}
