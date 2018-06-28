const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const common = require('./webpack.common.js');

const CWD = process.cwd();
const TRANSLATIONS_CHUNK = 'translations';
const COMMON_VENDOR_CHUNK = 'common_vendor';
const CHAT_VENDOR_CHUNK = 'chat_vendor';
const TALK_VENDOR_CHUNK = 'talk_vendor';
const WEB_WIDGET_CHUNK = 'web_widget';
const RUNTIME_CHUNK = 'runtime';

// Assets must be downloaded in the order specified in CHUNKS
const CHUNKS = [
  { name: RUNTIME_CHUNK },
  { name: COMMON_VENDOR_CHUNK },
  { name: TRANSLATIONS_CHUNK },
  { name: CHAT_VENDOR_CHUNK, feature: 'chat' },
  { name: TALK_VENDOR_CHUNK, feature: 'talk' },
  { name: WEB_WIDGET_CHUNK }
];

const splitChunkConfig = (name, type = 'initial') => {
  return {
    test: name,
    name,
    chunks: type
  };
};

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  entry: {
    [WEB_WIDGET_CHUNK]: path.join(CWD, '/src/main.js'),
    [TRANSLATIONS_CHUNK]: [
      path.join(CWD, '/src/translation/ze_translations.js'),
      path.join(CWD, '/src/translation/ze_countries.js'),
      path.join(CWD, '/src/translation/ze_localeIdMap.js')
    ],
    [COMMON_VENDOR_CHUNK]: [
      'lodash', 'react', 'react-dom', 'redux', 'core-js'
    ],
    [CHAT_VENDOR_CHUNK]: ['chat-web-sdk'],
    [TALK_VENDOR_CHUNK]: ['libphonenumber-js', 'socket.io-client']
  },
  output: {
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        [TRANSLATIONS_CHUNK]: splitChunkConfig(TRANSLATIONS_CHUNK),
        [COMMON_VENDOR_CHUNK]: splitChunkConfig(COMMON_VENDOR_CHUNK),
        [CHAT_VENDOR_CHUNK]: splitChunkConfig(CHAT_VENDOR_CHUNK, 'async'),
        [TALK_VENDOR_CHUNK]: splitChunkConfig(TALK_VENDOR_CHUNK, 'async')
      }
    }
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
