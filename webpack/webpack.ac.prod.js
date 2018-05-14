const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');
const prodConf = require('./webpack.prod.js');
const externals = require('./externals');
const prefix = process.cwd();

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  entry: {
    'web_widget': path.join(prefix, '/src/main.js')
  },
  externals,
  plugins: prodConf.plugins
});
