var gulp = require('gulp'),
    gutil = require('gulp-util'),
    react = require('gulp-react'),
    uglify = require('gulp-uglify'),
    inlineSource = require('gulp-inline-source'),
    minifyHTML = require('gulp-minify-html'),
    rimraf = require('gulp-rimraf'),
    webpack = require('webpack'),
    runSequence = require('run-sequence'),
    webpackConfig = require('../webpack.config.js'),
    es6Transpiler = require('gulp-es6-transpiler'),
    fs = require('fs'),
    path = require('path'),
    predef = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.jshintrc'), 'utf8')).predef;

function getGlobals() {
  var globals = {};

  predef.forEach(function(global) {
    globals[global] = true;
  });

  return globals;
}

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
    .pipe(gulp.dest('build/test'));
});

gulp.task('build:src', function() {
  var es6ModuleTranspiler = require('gulp-es6-module-transpiler');

  return gulp.src('src/**/*.js')
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(es6Transpiler({
      globals: getGlobals()
    }))
    .pipe(gulp.dest('build/src'));
});

gulp.task('build:cachebuster-js', function() {
  return gulp.src('src/cacheBuster/update.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:cachebuster-html', function() {
  return gulp.src('src/cacheBuster/update.html')
    .pipe(inlineSource())
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:cachebuster-clean', function() {
  return gulp.src('./dist/update.js')
    .pipe(rimraf());
});

gulp.task('build:cachebuster', function(callback) {
  runSequence(
    'build:cachebuster-js',
    'build:cachebuster-html',
    'build:cachebuster-clean',
    callback
  );
});

gulp.task('build:bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', function(callback) {
  runSequence(
    'lint',
    'build:cachebuster',
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

