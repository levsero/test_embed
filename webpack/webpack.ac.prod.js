const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const common = require('./webpack.ac.common.js')
const chunks = require('./chunks')
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const PUBLIC_PATH = process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest'

let config = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: PUBLIC_PATH + '/'
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new ManifestPlugin({
      fileName: 'asset_manifest.json',
      publicPath: '',
      filter: file => {
        if (!file.isChunk) return false

        return Boolean(chunks.http2Chunks(file.chunk.name))
      },
      sort: function(a, b) {
        const priorityA = chunks.priority(a.chunk.name)
        const priorityB = chunks.priority(b.chunk.name)

        return priorityA - priorityB
      },
      generate: function(seed, files) {
        const assets = files
          .filter(file => path.extname(file.path) !== '.map')
          .map(function(file) {
            const chunk = chunks.http2Chunks(file.chunk.name)
            const asset = { path: file.path.replace('public/', '') }

            if (chunk && chunk !== 'common') {
              asset.feature = chunk
            }

            return asset
          }, seed)

        return { assets }
      }
    }),
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
        rollbarEndpoint: process.env.ROLLBAR_ENDPOINT
      })
    ]
  })
}

module.exports = config
