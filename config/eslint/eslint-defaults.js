module.exports = {
  'env': { 'node': true },
  'extends': 'eslint:recommended',
  'rules': {
    'jasmine/no-spec-dupes': 0,
    'import/extensions': 2,
    'padded-blocks': [
      2,
      'never'
    ],
    'indent': [
      2,
      2
    ],
    'quotes': [
      2,
      'single',
      'avoid-escape'
    ],
    'linebreak-style': [
      2,
      'unix'
    ],
    'semi': [
      2,
      'always'
    ],
    'object-curly-spacing': [2, 'always'],
    'strict': 0,
    'no-case-declarations': 0,
    'no-multiple-empty-lines': [
      2,
      {
        'max': 1
      }
    ],
    'no-trailing-spaces': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'eol-last': 2,
    'no-spaced-func': 2,
    'camelcase': 2,
    'newline-after-var': 2,
    'keyword-spacing': 2,
    'dot-notation': 2,
    'eqeqeq': 2,
    'spaced-comment': 2,
    'yoda': 2,
    'max-len': [
      2,
      120,
      4,
      {
        'ignoreComments': true,
        'ignoreUrls': true
      }
    ]
  }
};
