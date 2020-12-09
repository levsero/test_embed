const fs = require('fs')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const common = require('./webpack.ac.common.js')
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const PUBLIC_PATH = process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest'

let config = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: PUBLIC_PATH + '/'
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
      reportFilename: '../report.html'
    }),
    new StatsWriterPlugin({
      filename: '../package_sizes.json',
      stats: {
        assets: true,
        assetsSort: 'size',
        builtAt: true,
        chunks: false,
        all: true,
        modules: true,
        maxModules: 0,
        errors: false,
        warnings: false
      }
    })
  ]
})

if (process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENDPOINT) {
  config = merge(config, {
    plugins: [
      new RollbarSourceMapPlugin({
        accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
        version: version,
        publicPath: PUBLIC_PATH,
        rollbarEndpoint: process.env.ROLLBAR_ENDPOINT,
        includeChunks: [
          'messenger',
          'preload',
          'talk-sdk',
          'vendors~lazy/talk',
          'vendors~lazy/web_widget',
          'vendors~lazy/talk/click_to_call~snapcall',
          'vendors~messenger',
          'vendors~web_widget',
          'web_widget'
        ]
      })
    ]
  })
}

module.exports = config
