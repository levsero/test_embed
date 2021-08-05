const path = require('path')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
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
    'babel-plugin-inline-import-data-uri',
  ],
  env: {
    development: {
      plugins: [
        'babel-plugin-styled-components',
        [
          'module-resolver',
          {
            root: [path.resolve(__dirname, './src')],
            alias: {
              src: path.resolve(__dirname, './src'),
            },
          },
        ],
      ],
    },
    test: {
      presets: [
        ['@babel/preset-env'],
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
            root: ['./src'],
            alias: {
              src: './src',
            },
          },
        ],
      ],
    },
    production: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: false,
          },
        ],
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
        'babel-plugin-inline-import-data-uri',
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              src: './src',
            },
          },
        ],
      ],
    },
  },
}
