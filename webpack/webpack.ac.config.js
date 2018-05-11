const path = require('path');
const merge = require('webpack-merge');

const config = require('./webpack.prod.js');
const externals = require('./externals');
const prefix = process.cwd();

module.exports = merge(config, {
  entry: {
    'web_widget': path.join(prefix, '/src/main.js')
  },
  externals
});
