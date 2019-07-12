const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const chunks = require('./chunks')

const CWD = process.cwd()

const splitChunkConfig = (name, type = 'initial') => {
  return {
    test: name,
    name,
    chunks: type
  }
}

module.exports = merge(common, {
  entry: {
    [chunks.WEB_WIDGET_CHUNK]: path.join(CWD, '/src/main.js'),
    [chunks.COMMON_VENDOR_CHUNK]: ['lodash', 'react', 'react-dom', 'redux', 'core-js', 'rollbar'],
    [chunks.CHAT_VENDOR_CHUNK]: ['chat-web-sdk', 'react-slick'],
    [chunks.TALK_VENDOR_CHUNK]: ['libphonenumber-js', 'socket.io-client']
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        [chunks.COMMON_VENDOR_CHUNK]: splitChunkConfig(chunks.COMMON_VENDOR_CHUNK),
        [chunks.CHAT_VENDOR_CHUNK]: splitChunkConfig(chunks.CHAT_VENDOR_CHUNK, 'async'),
        [chunks.TALK_VENDOR_CHUNK]: splitChunkConfig(chunks.TALK_VENDOR_CHUNK, 'async')
      }
    }
  }
})
