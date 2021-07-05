const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const packageJson = require('./package.json')

const peerDependencies = Object.keys(packageJson.peerDependencies).reduce(
  (prev, dependencyName) => ({
    ...prev,
    [dependencyName]: dependencyName,
  }),
  {}
)

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sunco-js-client.js',
    library: '@zendesk/sunco-js-client',
    libraryTarget: 'umd',
  },
  externals: peerDependencies,
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
      reportFilename: './report.html',
    }),
  ],
}
