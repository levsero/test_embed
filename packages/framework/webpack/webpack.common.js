const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin')

const legalNotices =
  'Our embeddable contains third-party, open source software and/or libraries. ' +
  'To view them and their license terms, go to http://goto.zendesk.com/embeddable-legal-notices'

const DEV = 'development'
const PROD = 'production'
const assetBasePath = process.env.STATIC_ASSETS_DOMAIN || 'https://static.zdassets.com'
const embeddableEnv = process.env.EMBEDDABLE_FRAMEWORK_ENV || process.env.NODE_ENV || DEV

const projectRoot = path.resolve(__dirname, '../')
const messengerRoot = path.resolve(__dirname, '../', '../', 'web-widget-messenger')
const classicRoot = path.resolve(__dirname, '../', '../', 'web-widget-classic')

const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

const cssModulesName = embeddableEnv === DEV ? '[path][name]-[local]' : '[local]-[hash:base64:5]'

const babelLoaderPlugins =
  embeddableEnv === PROD ? [['react-remove-properties', { properties: ['data-testid'] }]] : []

if (process.env.USE_DASHBOARD && embeddableEnv !== PROD) {
  babelLoaderPlugins.push('react-refresh/babel')
}

module.exports = {
  output: {
    path: path.resolve(projectRoot, 'dist/public'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(projectRoot, 'src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: babelLoaderPlugins,
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(messengerRoot, 'messengerSrc'),
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(messengerRoot, '.babelrc.json'),
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(classicRoot, 'classicSrc'),
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(classicRoot, '.babelrc.json'),
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/@zendeskgarden/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: cssModulesName,
              },
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `$asset-base-path: "${assetBasePath}";`,
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
      { test: /lodash/, loader: 'imports-loader' },
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
        test: /\.(png|mp3)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      src: path.join(projectRoot + '/src'),
      '@zendesk/web-widget-messenger': path.resolve(messengerRoot, 'messengerSrc'),
      messengerSrc: path.resolve(messengerRoot, 'messengerSrc'),
      '@zendesk/web-widget-classic': path.resolve(classicRoot, 'classicSrc'),
      classicSrc: path.resolve(classicRoot, 'classicSrc'),
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __EMBEDDABLE_FRAMEWORK_ENV__: JSON.stringify(embeddableEnv),
      __ASSET_BASE_PATH__: JSON.stringify(assetBasePath),
    }),
    new webpack.BannerPlugin({
      banner: legalNotices,
    }),
    new RetryChunkLoadPlugin({
      cacheBust: `function() {
        return Date.now();
      }`,
      timeout: 2000,
      maxRetries: 3,
    }),
  ],
}
