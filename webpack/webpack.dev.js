const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

const version = String(fs.readFileSync('dist/VERSION_HASH')).trim();

module.exports = merge(common, {
  mode: 'development',
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
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __DEV__: JSON.stringify(true)
    }),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, './node_modules/'),
      path.resolve(__dirname, './test/')
    ])
  ]
});
