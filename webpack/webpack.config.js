var path = require('path');
var fs = require('fs');
var prefix = process.cwd();
var svgoConfig = JSON.stringify({
  plugins: [
    {removeTitle: true},
    {convertPathData: false}
  ]
});

var config = {
  entry: {
    main: path.join(prefix, '/src/main.js'),
    webWidgetPreview: path.join(prefix, '/src/webWidgetPreview.js')
  },
  output: {
    path: path.join(prefix, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader?includePaths[]=src/styles/components/'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'css-loader?modules&importLoaders=2&localIdentName=[path][name]-[local]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      { test: /base\.css$/, loader: 'css-loader' },
      { test: /lodash/, loader: 'imports-loader?define=>false' },
      {
        test: /\.svg$/,
        use: [
          'raw-loader',
          'svgo-loader?' + svgoConfig
        ]
      },
      {
        test: /chat-web-sdk/,
        use: ['source-map-loader']
      },
      {
        test: /\.png$/,
        use: 'url-loader'
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
      vendor: path.join(prefix + '/src/vendor'),
      // CSS Components
      componentCSS: path.join(prefix + '/src/styles/components'),
      mainCSS: path.join(prefix + '/src/styles/main.scss'),
      icons: path.join(prefix + '/src/asset/icons')
    },
    modules: ['node_modules']
  }
};

module.exports = {
  root: config,
  version: String(fs.readFileSync('dist/VERSION_HASH')).trim()
};
