var config = require('./webpack.config');
var webpack = require('webpack');
var fs = require('fs');

var version = String(fs.readFileSync('dist/VERSION_HASH')).trim();
config.plugins = [
  new webpack.DefinePlugin({
    __EMBEDDABLE_VERSION__: JSON.stringify(version),
    __DEV__: JSON.stringify(true)
  })
];

module.exports = config;
