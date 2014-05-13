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
      { test: /\.scss$/, loader: 'css!autoprefixer-loader?browsers=last 2 versions, > 1%, Firefox ESR, ie >= 9!sass-loader?includePaths[]=src/styles/components/' },
      { test: /base\.css$/, loader: 'css', minimize: true },
      { test: /\.js$/, loader: 'es6-loader' }
    ]
  },
  resolve: {
    alias: {
      react: 'react/addons.js',
      lodash: 'lodash/dist/lodash.underscore.js',
      // Framework
      component: path.join(__dirname, 'src/component'),
      embed: path.join(__dirname, 'src/embed'),
      mixin: path.join(__dirname, 'src/component/mixin'),
      service: path.join(__dirname, 'src/service'),
      src: path.join(__dirname, 'src'),
      util: path.join(__dirname, 'src/util'),
      // CSS Components
      baseCSS: path.join(__dirname, 'src/styles/base.css'),
      componentCSS: path.join(__dirname, 'src/styles/components'),
      mainCSS: path.join(__dirname, 'src/styles/main.scss'),
      suit: 'suit/index.css'
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
