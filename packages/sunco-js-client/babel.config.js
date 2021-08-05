const path = require('path')

module.exports = (api) => {
  const aliasPath = api.env('development') ? path.resolve(__dirname, './src') : './src'

  return {
    presets: [
      [
        '@babel/preset-env',
        {
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
