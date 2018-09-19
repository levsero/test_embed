const webpack = require('webpack');
const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.ac.common.js');
const chunks = require('./chunks');

// Assets must be downloaded in the order specified in CHUNKS
const CHUNKS = [
  { name: chunks.RUNTIME_CHUNK },
  { name: chunks.COMMON_VENDOR_CHUNK },
  { name: chunks.TRANSLATIONS_CHUNK },
  { name: chunks.CHAT_VENDOR_CHUNK, feature: 'chat' },
  { name: chunks.TALK_VENDOR_CHUNK, feature: 'talk' },
  { name: chunks.WEB_WIDGET_CHUNK }
];

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new ManifestPlugin({
      fileName: 'asset_manifest.json',
      publicPath: '',
      sort: function (a, b) {
        const indexA = CHUNKS.findIndex(chunk => chunk.name === a.chunk.name),
          indexB = CHUNKS.findIndex(chunk => chunk.name === b.chunk.name);

        // Sanity check to make sure all chunks are accounted for
        if (indexA === -1 || indexB === -1) {
          throw "Found chunk that's not in CHUNKS constant!";
        }

        return indexA - indexB;
      },
      generate: function (seed, files) {
        const assets =  files.map(function (file) {
          const chunk = CHUNKS.find(chunk => chunk.name === file.chunk.name);
          const asset = { path: file.path };

          if (chunk.feature) asset.feature = chunk.feature;

          return asset;
        }, seed);

        return { assets };
      }
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
  ]
});
