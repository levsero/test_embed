const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const packageJson = require('./package.json')

const peerDependencies = Object.keys(packageJson.peerDependencies).reduce(
  (prev, dependencyName) => ({
    ...prev,
    [dependencyName]: dependencyName
  }),
  {}
)

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'conversation-components.js',
    library: '@zendesk/conversation-components',
    libraryTarget: 'umd'
  },
  externals: peerDependencies,
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
      reportFilename: './report.html'
    })
  ]
}
