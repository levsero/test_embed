const path = require('path')
const { ModuleFederationPlugin } = require('webpack').container
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const assetBasePath = process.env.STATIC_ASSETS_DOMAIN || 'https://static.zdassets.com'
const embeddableEnv = process.env.EMBEDDABLE_FRAMEWORK_ENV || process.env.NODE_ENV || 'development'
const version = 'version'

const isDev = embeddableEnv === 'development'

module.exports = {
  entry: path.resolve(__dirname, 'messengerSrc/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    publicPath: isDev ? 'http://localhost:1336/dist/' : assetBasePath,
    filename: isDev ? 'web-widget-[name].js' : 'web-widget-[name]-[contenthash].js',
  },
  mode: embeddableEnv,
  resolve: {
    alias: {
      messengerSrc: path.resolve(__dirname, 'messengerSrc'),
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'messengerSrc'),
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
                  { inlineStyles: false },
                ],
              },
              titleProp: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'messenger',
      exposes: {
        '.': './messengerSrc/index.js',
      },
    }),
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __EMBEDDABLE_FRAMEWORK_ENV__: JSON.stringify(embeddableEnv),
      __ASSET_BASE_PATH__: JSON.stringify(assetBasePath),
      __DEV__: JSON.stringify(true),
    }),
    new WebpackManifestPlugin({
      fileName: 'asset_manifest.json',
      publicPath: '',
      filter: (file) => {
        return Boolean(file.isInitial) && file.chunk.name === 'messenger'
      },
      generate: function (seed, files) {
        const assets = files
          .filter((file) => path.extname(file.path) !== '.map')
          .map(function (file) {
            return { path: file.path.replace('public/', '') }
          }, seed)

        if (assets.length !== 1) {
          throw new Error(`Unexpected amount of files, expected 1, got ${assets.length}`)
        }

        return assets[0]
      },
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    port: 1336,
  },
}
