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
        use: {
          loader: 'babel-loader?cacheDirectory=true'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader?modules&importLoaders=2&localIdentName=[path][name]-[local]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules\/@zendesk\/garden-css/,
        use: [
          'css-loader?importLoaders=2',
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
      },
      {
        test: /\.(yml|yaml)/,
        use: [ 'json-loader', 'yaml-loader' ]
      }
    ]
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
    modules: ['node_modules']
  }
};

module.exports = {
  root: config,
  version: String(fs.readFileSync('dist/VERSION_HASH')).trim()
};
