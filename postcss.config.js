module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions', 'Firefox ESR', 'ie >= 10', 'Safari >= 8']
    })
  ]
};
