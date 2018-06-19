const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');

const common = require('./webpack.common.js');
const prodConf = require('./webpack.prod.js');

const CWD = process.cwd();
const TRANSLATIONS_CHUNK = 'translations';
const COMMON_VENDOR_CHUNK = 'common_vendor';
const CHAT_VENDOR_CHUNK = 'chat_vendor';
const TALK_VENDOR_CHUNK = 'talk_vendor';

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
    'web_widget': path.join(CWD, '/src/main.js'),
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
        // move runtime.js to the top
        if (a.name === 'runtime.js') {
          return -1;
        }
        if (b.name === 'runtime.js') {
          return 1;
        }
        // move web_widget to the bottom
        if (a.name === 'web_widget.js') {
          return 1;
        }
        if (b.name === 'web_widget.js') {
          return -1;
        }
        // other assets will be compared alphabetically
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
      generate: function (seed, files) {
        const assets =  files.map(function (file) {
          return file.path;
        }, seed);

        return { assets };
      }
    }),
    ...prodConf.plugins
  ]
});
