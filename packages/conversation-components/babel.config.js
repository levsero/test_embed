const path = require('path')

module.exports = (api) => {
  const aliasPath = api.env('development') ? path.resolve(__dirname, './src') : './src'

  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: api.env('test') ? undefined : false,
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
        'inline-react-svg',
        {
          svgo: {
            plugins: [
              { name: 'removeTitle', active: true },
              { name: 'convertPathData', active: false },
              { name: 'convertStyleToAttrs', active: false },
              { name: 'removeViewBox', active: false },
              { name: 'prefixIds', active: false },
              { name: 'cleanupIDs', active: false },
              { name: 'inlineStyles', active: false },
            ],
          },
        },
      ],
      [
        'module-resolver',
        {
          root: [aliasPath],
          alias: {
            src: aliasPath,
          },
        },
      ],
      'babel-plugin-inline-import-data-uri',
    ],
  }

  if (!api.env('test')) {
    config.plugins.push([
      'babel-plugin-styled-components',
      {
        displayName: !api.env('production'),
      },
    ])
  }

  return config
}
