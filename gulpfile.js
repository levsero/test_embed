var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var react = require('gulp-react');

var testFiles = [
  'node_modules/lodash/lodash.js',
  'node_modules/es5-shim/es5-shim.js',
  'node_modules/jasmine-ajax/lib/mock-ajax.js',
  'dist/main.js',
  'test/**/*.js'
];

gulp.task('build', ['lint', 'bootstrap', 'webpack', 'test']);

gulp.task('bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('webpack', function(callback) {
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

gulp.task('test', ['webpack'], function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task("webpack-dev-server", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    stats: {
      colors: true
    }
  }).listen(1337, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:1337/webpack-dev-server/example/index.html');
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

gulp.task('default', ['build']);

