const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');
const devConf = require('./webpack.dev.js');
const externals = require('./externals');
const prefix = process.cwd();

module.exports = merge(common, {
  mode: 'development',
  entry: {
    'web_widget': path.join(prefix, '/src/main.js')
  },
  externals,
  devServer: {
    contentBase: ['example', './'],
    publicPath: '/dist/web_widget/FFFFFF/'
  },
  plugins: devConf.plugins
});
