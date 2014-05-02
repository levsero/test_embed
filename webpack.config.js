var path = require('path');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "main.js"
    },
    module: {
        preLoaders: [
          { test: /\.js$/, loader: "jsx-loader" },
          { test: /\.js$/, exclude: 'node_modules', loader: 'jshint-loader' }
        ],
        loaders: [
            { test: /\.css$/, loader: "css" },
            { test: /\.js$/, loader: "es6-loader" }
        ]
    },
    resolve: {
        alias: {
            base: path.join(__dirname, 'src/styles/base.css'),
            normalize: 'normalize.css/normalize.css',
            'align-util.css': 'suitcss-utils/node_modules/suitcss-utils-align/align.css'
        }
    }
};
