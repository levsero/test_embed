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
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false },
                  { convertStyleToAttrs: false },
                  { removeViewBox: false },
                  { prefixIds: false },
                  { cleanupIDs: false },
                  { inlineStyles: false }
                ]
              },
              titleProp: true
            }
          }
        ]
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
