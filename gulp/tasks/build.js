var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');

gulp.task('build', ['lint', 'inlinebootstrap'], function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];

  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  });
});

