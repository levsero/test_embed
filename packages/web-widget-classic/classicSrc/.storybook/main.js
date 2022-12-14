const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const prefix = process.cwd()
const version = String(fs.readFileSync('dist/VERSION_HASH')).trim()

module.exports = {
  stories: ['../classicSrc/**/*.stories.mdx', '../classicSrc/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-controls', '@storybook/addon-actions'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve('./')]
    config.resolve.alias = {
      ...config.resolve.alias,
      // Framework
      // component: path.join(prefix + '/classicSrc/component'),
      // components: path.join(prefix + '/classicSrc/components'),
      constants: path.join(prefix + '/classicSrc/constants'),
      // embed: path.join(prefix + '/classicSrc/embed'),
      embeds: path.join(prefix + '/classicSrc/embeds'),
      // errors: path.join(prefix + '/classicSrc/errors'),
      // mixin: path.join(prefix + '/classicSrc/component/mixin'),
      service: path.join(prefix + '/classicSrc/service'),
      // src: path.join(prefix + '/src'),
      utility: path.join(prefix + '/classicSrc/util'),
      translation: path.join(prefix + '/classicSrc/translation'),
      // types: path.join(prefix + '/classicSrc/types'),
      // vendor: path.join(prefix + '/classicSrc/vendor'),
      // // CSS Components
      // componentCSS: path.join(prefix + '/classicSrc/styles/components'),
      // icons: path.join(prefix + '/classicSrc/asset/icons'),
      // globalCSS: path.join(prefix + '/classicSrc/styles/globals.scss')
    }
    config.plugins = [
      ...config.plugins,
      new webpack.NormalModuleReplacementPlugin(/client-i18n-tools/, (resource) => {
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
        __EMBEDDABLE_VERSION__: JSON.stringify(version),
      }),
    ]

    // Don't use Storybook's default SVG Configuration
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test.toString().includes('svg')) {
        const test = rule.test.toString().replace('svg|', '').replace(/\//g, '')
        return { ...rule, test: new RegExp(test) }
      } else {
        return rule
      }
    })

    config.module.rules.push({
      test: /\.svg$/i,
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
    })

    // Return the altered config
    return config
  },
}
