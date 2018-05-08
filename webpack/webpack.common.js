const path = require('path');
const prefix = process.cwd();

const svgoConfig = JSON.stringify({
  plugins: [
    { removeTitle: true },
    { convertPathData: false }
  ]
});

module.exports = {
  entry: {
    main: path.join(prefix, '/src/main.js'),
    webWidgetPreview: path.join(prefix, '/src/webWidgetPreview.js'),
    chatPreview: path.join(prefix, '/src/chatPreview.js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
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
          'css-loader?importLoaders=1',
          'postcss-loader'
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
    filename: '[name].js'
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
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  }
};
