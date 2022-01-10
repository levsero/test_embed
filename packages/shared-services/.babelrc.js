const path = require('path')

module.exports = (api) => {
  const aliasPath = api.env('production') ? './src' : path.resolve(__dirname, './src')

  return {
    presets: [
      [
        '@babel/preset-env',
        api.env('test')
          ? {
              targets: {
                node: 'current',
              },
              useBuiltIns: false,
            }
          : {
              modules: false,
              useBuiltIns: 'usage',
              corejs: '3.6',
            },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: [aliasPath],
          alias: {
            src: aliasPath,
          },
        },
      ],
    ],
    env: {
      development: {
        plugins: ['lodash'],
      },
      production: {
        plugins: ['lodash'],
      },
    },
  }
}
