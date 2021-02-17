const path = require('path')
const { merge } = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const common = require('./webpack.common.js')
const chunks = require('./chunks')

const projectRoot = path.resolve(__dirname, '../')

module.exports = merge(common, {
  entry: {
    preload: path.join(projectRoot, '/src/framework/preload.js')
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      chunks(chunk) {
        return !chunks.excludeFromVendoring(chunk.name)
      }
    }
  },
  plugins: [
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
    })
  ]
})
