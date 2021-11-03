const path = require('path')
const { merge } = require('webpack-merge')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const common = require('./webpack.common.js')
const chunks = require('./chunks')

const projectRoot = path.resolve(__dirname, '../')

module.exports = merge(common, {
  entry: {
    framework: path.join(projectRoot, '/src/framework/index.js'),
  },
  output: {
    filename: 'web-widget-[name]-[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return !chunks.excludeFromVendoring(chunk.name)
      },
      minSize: 200000,
      enforceSizeThreshold: 1000000000000,
    },
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: 'asset_manifest.json',
      publicPath: '',
      filter: (file) => {
        if (file.isInitial) {
          return true
        }

        if (!file.isChunk) return false

        return Boolean(chunks.http2Chunks(file.chunk.name))
      },
      sort: function (a, b) {
        const priorityA = chunks.priority(a.chunk.name) || 10
        const priorityB = chunks.priority(b.chunk.name) || 10

        return priorityA - priorityB
      },
      generate: function (seed, files) {
        const assets = files
          .filter((file) => path.extname(file.path) !== '.map')
          .map(function (file) {
            const chunk = chunks.http2Chunks(file.chunk.name)
            const asset = { path: file.path.replace('public/', '') }

            if (chunk && chunk !== 'common') {
              asset.feature = chunk
            }

            return asset
          }, seed)

        return { assets }
      },
    }),
  ],
})
