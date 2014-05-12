var path = require('path');

module.exports = {
  cache: true,
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'jsx-loader' }
    ],
    loaders: [
      { test: /\.scss$/, loader: 'css!sass-loader' },
      { test: /base\.css$/, loader: 'css' },
      { test: /\.js$/, loader: 'es6-loader' }
    ]
  },
  resolve: {
    alias: {
      react: 'react/addons.js',
      lodash: 'lodash/dist/lodash.underscore.js',
      src: path.join(__dirname, 'src'),
      mixin: path.join(__dirname, 'src/mixins'),
      component: path.join(__dirname, 'src/components'),
      // CSS Components
      baseCSS: path.join(__dirname, 'src/styles/base.css'),
      mainCSS: path.join(__dirname, 'src/styles/main.scss'),
      suit: 'suit/index.css',
      componentCSS: path.join(__dirname, 'src/styles/components')
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
