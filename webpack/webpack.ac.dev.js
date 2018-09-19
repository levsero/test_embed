const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.ac.common.js');
const fs = require('fs');

const htmlTemplates = require('../dev/html_templates');

module.exports = () => {
  const userConfig = process.env.USER_CONFIG || 'example';
  const config = JSON.parse(
    fs.readFileSync(`./dev/configs/${userConfig}.json`)
  );

  return merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    devServer: {
      host: '0.0.0.0',
      port: 1337,
      disableHostCheck: true,
      headers: { 'Cache-Control': 'no-cache, no-store' }
    },
    plugins: [
      ...htmlTemplates(config),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true)
      }),
      new webpack.WatchIgnorePlugin([
        path.resolve(__dirname, './test/'),
        path.resolve(__dirname, './node_modules/')
      ]),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false
      })
    ]
  });
};
