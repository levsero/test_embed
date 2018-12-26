const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const chunks = require('./chunks');

const CWD = process.cwd();

const splitChunkConfig = (name, type = 'initial') => {
  return {
    test: name,
    name,
    chunks: type
  };
};

module.exports = merge(common, {
  entry: {
    [chunks.WEB_WIDGET_CHUNK]: path.join(CWD, '/src/main.js'),
    [chunks.TRANSLATIONS_CHUNK]: [
      path.join(CWD, '/src/translation/ze_translations.js'),
      path.join(CWD, '/src/translation/ze_countries.js'),
      path.join(CWD, '/src/translation/ze_localeIdMap.js')
    ],
    [chunks.COMMON_VENDOR_CHUNK]: [
      'lodash', 'react', 'react-dom', 'redux', 'core-js'
    ],
    [chunks.CHAT_VENDOR_CHUNK]: ['chat-web-sdk', 'react-slick', 'luxon'],
    [chunks.TALK_VENDOR_CHUNK]: ['libphonenumber-js', 'socket.io-client']
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        [chunks.TRANSLATIONS_CHUNK]: splitChunkConfig(chunks.TRANSLATIONS_CHUNK),
        [chunks.COMMON_VENDOR_CHUNK]: splitChunkConfig(chunks.COMMON_VENDOR_CHUNK),
        [chunks.CHAT_VENDOR_CHUNK]: splitChunkConfig(chunks.CHAT_VENDOR_CHUNK, 'async'),
        [chunks.TALK_VENDOR_CHUNK]: splitChunkConfig(chunks.TALK_VENDOR_CHUNK, 'async')
      }
    }
  }
});
