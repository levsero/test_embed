const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const common = require('./webpack.common.js');
const prefix = process.cwd();

module.exports = merge(common, {
  mode: 'development',
  entry: {
    main: path.join(prefix, '/src/main.js'),
    webWidgetPreview: path.join(prefix, '/src/webWidgetPreview.js'),
    chatPreview: path.join(prefix, '/src/chatPreview.js')
  },
  module: {
    rules: [
      {
        test: /chat-web-sdk/,
        use: 'source-map-loader'
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 1337,
    contentBase: 'example',
    publicPath: '/dist/',
    disableHostCheck: true,
    headers: { 'Cache-Control': 'no-cache, no-store' }
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true)
    }),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, './node_modules/'),
      path.resolve(__dirname, './test/')
    ]),
    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    })
  ]
});
