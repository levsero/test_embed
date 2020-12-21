const path = require('path')

const appSourceDir = path.join(__dirname, '..', 'src')
const nodeSourceDir = path.join(__dirname, '..', 'node_modules')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    const svgRule = config.module.rules.find(rule => 'test.svg'.match(rule.test))
    svgRule.exclude = [appSourceDir, nodeSourceDir]

    config.module.rules.push({
      test: /\.svg$/i,
      include: [appSourceDir, nodeSourceDir],
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

    return config
  }
}
