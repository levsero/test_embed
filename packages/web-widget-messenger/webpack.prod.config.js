const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
let config = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
      reportFilename: './report.html',
      excludeAssets: /locales/,
    }),
  ],
})

module.exports = config
