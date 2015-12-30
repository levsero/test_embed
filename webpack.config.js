var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var prefix = process.cwd();
var svgoConfig = JSON.stringify({
      plugins: [
        {removeTitle: true},
        {convertPathData: false}
      ]
    });

module.exports = {
  version: String(fs.readFileSync('dist/VERSION_HASH')).trim(),
  cache: true,
  entry: {
    main: path.join(prefix, '/src/main.js'),
    npsPreview: path.join(prefix, '/src/npsPreview.js')
  },
  output: {
    path: path.join(prefix, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?experimental'
      },
      {
        test: /\.scss$/,
        loader: [
          'css',
          '!autoprefixer?browsers=last 2 versions, > 1%, Firefox ESR, ie >= 9',
          '!sass?includePaths[]=src/styles/components/'
        ].join('')
      },
      { test: /base\.css$/, loader: 'css', minimize: true },
      { test: /lodash/, loader: 'imports?define=>false' },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.svg$/,
        loaders: [
          'raw',
          'svgo-loader?' + svgoConfig
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // Framework
      component: path.join(prefix + '/src/component'),
      embed: path.join(prefix + '/src/embed'),
      mixin: path.join(prefix + '/src/component/mixin'),
      service: path.join(prefix + '/src/service'),
      src: path.join(prefix + '/src'),
      utility: path.join(prefix + '/src/util'),
      translation: path.join(prefix + '/src/translation'),
      // CSS Components
      baseCSS: path.join(prefix + '/src/styles/base.css'),
      componentCSS: path.join(prefix + '/src/styles/components'),
      mainCSS: path.join(prefix + '/src/styles/main.scss'),
      suit: 'suit/index.css',
      icons: path.join(prefix + '/src/asset/icons')
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
