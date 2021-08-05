const path = require('path')

module.exports = {
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
        root: ['./src'],
        alias: {
          src: ['./src'],
        },
      },
    ],
  ],
  env: {
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
    },
  },
}
