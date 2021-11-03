const fs = require('fs')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const common = require('./webpack.ac.common.js')
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const PUBLIC_PATH = process.env.STATIC_ASSETS_DOMAIN + '/web_widget/latest'

let config = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    publicPath: PUBLIC_PATH + '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
      reportFilename: '../report.html',
      excludeAssets: /locales/,
    }),
    new StatsWriterPlugin({
      filename: '../package_sizes.json',
      stats: {
        assets: true,
      },
      transform(data) {
        return JSON.stringify(
          {
            outputPath: data.outputPath,
            assetsByChunkName: data.assetsByChunkName,
            assets: data.assets
              .filter(({ name }) => name)
              .map((asset) => ({
                name: asset.name,
                size: asset.size,
              })),
          },
          null,
          2
        )
      },
    }),
  ],
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
          'talk-sdk',
          'vendors~lazy/talk',
          'vendors~lazy/web_widget',
          'vendors~messenger',
          'vendors~web_widget',
          'web_widget',
        ],
      }),
    ],
  })
}

module.exports = config
