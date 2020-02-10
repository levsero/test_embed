const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const chunks = require('./chunks')

const CWD = process.cwd()

module.exports = merge(common, {
  entry: {
    preload: path.join(CWD, '/src/preload.js')
  },
  optimization: {
    runtimeChunk: 'single',
    namedChunks: true,
    splitChunks: {
      chunks(chunk) {
        return !chunks.excludeFromVendoring(chunk.name)
      }
    }
  }
})
