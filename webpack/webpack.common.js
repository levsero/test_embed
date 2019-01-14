const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const WEBPACK_JSONP_GLOBAL = 'zEWebpackJsonp';

const svgoConfig = JSON.stringify({
  plugins: [
    { removeTitle: true },
    { convertPathData: false },
    { convertStyleToAttrs: false }
  ]
});
const prefix = process.cwd();
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim();

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              localIdentName: '[path][name]-[local]',
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules\/@zendeskgarden/,
        use: [
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      },
      { test: /lodash/, loader: 'imports-loader?define=>false' },
      {
        test: /\.svg$/,
        use: [
          'raw-loader',
          'svgo-loader?' + svgoConfig
        ]
      },
      {
        test: /\.png$/,
        use: 'url-loader'
      },
      {
        test: /\.(yml|yaml)/,
        use: [
          'json-loader',
          'yaml-loader'
        ]
      }
    ]
  },
  output: {
    path: path.join(prefix, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    jsonpFunction: WEBPACK_JSONP_GLOBAL
  },
  resolve: {
    alias: {
      // Framework
      component: path.join(prefix + '/src/component'),
      constants: path.join(prefix + '/src/constants'),
      embed: path.join(prefix + '/src/embed'),
      mixin: path.join(prefix + '/src/component/mixin'),
      service: path.join(prefix + '/src/service'),
      src: path.join(prefix + '/src'),
      utility: path.join(prefix + '/src/util'),
      translation: path.join(prefix + '/src/translation'),
      types: path.join(prefix + '/src/types'),
      vendor: path.join(prefix + '/src/vendor'),
      // CSS Components
      componentCSS: path.join(prefix + '/src/styles/components'),
      icons: path.join(prefix + '/src/asset/icons'),
      globalCSS: path.join(prefix + '/src/styles/globals.scss')
    },
    extensions: ['.js'],
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version)
    })
  ]
};
