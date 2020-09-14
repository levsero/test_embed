const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const i18nPlugin = require('../webpack/i18nPlugin')
const prefix = process.cwd()
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()
const appSourceDir = path.join(__dirname, '..', 'src')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-controls'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve('./')]
    config.resolve.alias = {
      ...config.resolve.alias,
      // Framework
      // component: path.join(prefix + '/src/component'),
      // components: path.join(prefix + '/src/components'),
      constants: path.join(prefix + '/src/constants'),
      // embed: path.join(prefix + '/src/embed'),
      embeds: path.join(prefix + '/src/embeds'),
      // errors: path.join(prefix + '/src/errors'),
      // mixin: path.join(prefix + '/src/component/mixin'),
      service: path.join(prefix + '/src/service'),
      // src: path.join(prefix + '/src'),
      utility: path.join(prefix + '/src/util'),
      translation: path.join(prefix + '/src/translation')
      // types: path.join(prefix + '/src/types'),
      // vendor: path.join(prefix + '/src/vendor'),
      // // CSS Components
      // componentCSS: path.join(prefix + '/src/styles/components'),
      // icons: path.join(prefix + '/src/asset/icons'),
      // globalCSS: path.join(prefix + '/src/styles/globals.scss')
    }
    config.plugins = [
      ...config.plugins,
      new webpack.NormalModuleReplacementPlugin(/client-i18n-tools/, resource => {
        const absRootMockPath = path.resolve(
          __dirname,
          '../__mocks__/@zendesk/client-i18n-tools-storybook.js'
        )
        console.log('resource', resource)
        // Gets relative path from requesting module to our mocked module
        const relativePath = path.relative(resource.context, absRootMockPath)

        // Updates the `resource.request` to reference our mocked module instead of the real one
        resource.request = relativePath
      }),
      new webpack.DefinePlugin({
        __EMBEDDABLE_FRAMEWORK_ENV__: JSON.stringify('development'),
        __DEV__: JSON.stringify(true),
        __EMBEDDABLE_VERSION__: JSON.stringify(version)
      })
    ]

    const svgRule = config.module.rules.find(rule => 'test.svg'.match(rule.test))
    svgRule.exclude = [appSourceDir]

    config.module.rules.push({
      test: /\.svg$/i,
      include: [appSourceDir],
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
    })

    // Return the altered config
    return config
  }
}
