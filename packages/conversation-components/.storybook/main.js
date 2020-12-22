const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.resolve(__dirname, '../src')
    }

    // Don't use Storybook's default SVG Configuration
    config.module.rules = config.module.rules.map(rule => {
      if (rule.test.toString().includes('svg')) {
        const test = rule.test
          .toString()
          .replace('svg|', '')
          .replace(/\//g, '')
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
