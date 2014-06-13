var gulp = require('gulp'),
    gutil = require('gulp-util'),
    react = require('gulp-react'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    runSequence = require('run-sequence'),
    webpackConfig = require('../webpack.config.js'),
    es6Transpiler = require('gulp-es6-transpiler');

function webpackCallback(callback) {
  return function(err, stats) {
    if(err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  };
}

gulp.task('build:prod', function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'drop_console': true,
        'drop_debugger': true,
        'warnings': false
      }
    })
  ];

  return webpack(myConfig, webpackCallback(callback));
});

var debugBuild = webpack(webpackConfig);

gulp.task('build:debug', function(callback) {
  debugBuild.run(webpackCallback(callback));
});

gulp.task('build:test', function() {
  var es6ModuleTranspiler = require('gulp-es6-module-transpiler');

  return gulp.src(['test/**/*.js'])
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(es6Transpiler())
    .pipe(gulp.dest('build/test'));
});

gulp.task('build:src', function() {
  var es6ModuleTranspiler = require('gulp-es6-module-transpiler');

  return gulp.src('src/**/*.js')
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(es6Transpiler())
    .pipe(gulp.dest('build/src'));
});

gulp.task('build:bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', function(callback) {
  runSequence(
    'lint',
    'build:bootstrap',
    'build:prod',
    callback
  );
});

gulp.task('build-dev', function(callback) {
  runSequence(
    'bootstrap',
    'build:debug',
    callback
  );
});

