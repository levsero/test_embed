var path = require('path');
var prefix = process.cwd();

module.exports = {
  cache: true,
  entry: path.join(prefix, '/src/main.js'),
  output: {
    path: path.join(prefix, 'dist'),
    filename: 'main.js'
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'jsx-loader' }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loader: [
          'css',
          '!autoprefixer-loader?browsers=last 2 versions, > 1%, Firefox ESR, ie >= 9',
          '!sass-loader?includePaths[]=src/styles/components/'
        ].join('')
      },
      { test: /base\.css$/, loader: 'css', minimize: true },
      { test: /\.js$/, loader: 'es6-loader' }
    ]
  },
  resolve: {
    alias: {
      react: 'react/addons.js',
      lodash: 'lodash/dist/lodash.underscore.js',
      // Framework
      component: path.join(prefix + '/src/component'),
      embed: path.join(prefix + '/src/embed'),
      mixin: path.join(prefix + '/src/component/mixin'),
      service: path.join(prefix + '/src/service'),
      src: path.join(prefix + '/src'),
      util: path.join(prefix + '/src/util'),
      // CSS Components
      baseCSS: path.join(prefix + '/src/styles/base.css'),
      componentCSS: path.join(prefix + '/src/styles/components'),
      mainCSS: path.join(prefix + '/src/styles/main.scss'),
      suit: 'suit/index.css'
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
