const path = require('path');
const merge = require('webpack-merge');

const config = require('./webpack.dev.js');
const externals = require('./externals');
const prefix = process.cwd();

module.exports = merge(config, {
  entry: {
    'web_widget': path.join(prefix, '/src/main.js')
  },
  externals,
  devServer: {
    contentBase: ['example', './'],
    publicPath: '/dist/web_widget/FFFFFF/'
  }
});
