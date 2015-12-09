const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const inlineSource = require('gulp-inline-source');
const minifyHTML = require('gulp-minify-html');
const rimraf = require('gulp-rimraf');
const webpack = require('webpack');
const runSequence = require('run-sequence');
const webpackConfig = require('../webpack.config.js');
const replace = require('gulp-replace');
const fs = require('fs');
const shell = require('gulp-shell');
var debugBuild;

function webpackCallback(callback) {
  return function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  };
}

gulp.task('build:prod', ['build:version:generate'], function(callback) {
  const version = String(fs.readFileSync('dist/VERSION_HASH')).trim();
  const config = Object.create(webpackConfig);

  config.plugins = [
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __DEV__: JSON.stringify(false),
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

  return webpack(config, webpackCallback(callback));
});

gulp.task('build:debug', ['build:version:generate'], function(callback) {
  const version = String(fs.readFileSync('dist/VERSION_HASH')).trim();
  const config = Object.create(webpackConfig);

  config.plugins = [
    new webpack.DefinePlugin({
      __EMBEDDABLE_VERSION__: JSON.stringify(version),
      __DEV__: JSON.stringify(true)
    })
  ];

  if (typeof debugBuild === 'undefined') {
    debugBuild = webpack(config);
  }

  return debugBuild.run(webpackCallback(callback));
});

gulp.task('build:version:generate', shell.task(
  'git rev-parse --short HEAD > ./dist/VERSION_HASH'
));

gulp.task('build:version:clean', function() {
  return gulp.src('./dist/VERSION_HASH')
    .pipe(rimraf());
});

gulp.task('build:cachebuster-js', function() {
  return gulp.src('src/cacheBuster/update.js')
    .pipe(replace(
      /{{versionHash}}/g,
      String(fs.readFileSync('dist/VERSION_HASH')).trim()
    ))
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

gulp.task('build:cachebuster', ['build:version:generate'], function(callback) {
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
    'build:version:clean',
    callback
  );
});

gulp.task('build-dev', function(callback) {
  runSequence(
    'bootstrap',
    'build:debug',
    'build:version:clean',
    callback
  );
});
