var path = require('path');

module.exports = {
  cache: true,
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "main.js"
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "jsx-loader" }
    ],
    loaders: [
      { test: /\.css$/, loader: "css" },
      { test: /\.js$/, loader: "es6-loader" }
    ]
  },
  resolve: {
    alias: {
      react: 'react/addons.js',
      lodash: 'lodash/dist/lodash.underscore.js',
      Frame: path.join(__dirname, 'src/components/Frame.js'),
      // CSS Components
      baseCSS: path.join(__dirname, 'src/styles/base.css'),
      suit: 'suit/index.css',
      components: path.join(__dirname, 'src/styles/components')
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};
