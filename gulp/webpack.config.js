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
      { test: /\.json$/, loader: 'json' },
      { test: /\.(woff|eot|ttf)$/, loader: 'url' }
    ]
  },
  resolve: {
    alias: {
      lodash: 'lodash/dist/lodash.underscore.js',
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
      suit: 'suit/index.css'
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
