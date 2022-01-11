const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = () => {
  return merge(common, {
    mode: 'production',
    output: {
      filename: '[name].js',
      publicPath: '/',
    },
    devServer: {
      host: 'localhost',
      hot: false,
      inline: false,
      port: 5124,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store',
      },
    },
  })
}
