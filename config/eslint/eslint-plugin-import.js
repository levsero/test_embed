module.exports = {
  plugins: ['import'],
  rules: {
    'import/extensions': [2, { js: 'never', scss: 'always', json: 'always', svg: 'always' }]
  }
}
