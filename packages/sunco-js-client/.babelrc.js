const path = require('path')

module.exports = (api) => {
  const aliasPath = api.env('development') ? path.resolve(__dirname, './src') : './src'

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
  }
}
