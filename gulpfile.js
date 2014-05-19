var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var react = require('gulp-react');
var inlineSource = require('gulp-inline-source');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

var testFiles = [
  'node_modules/lodash/lodash.js',
  'node_modules/es5-shim/es5-shim.js',
  'node_modules/jasmine-ajax/lib/mock-ajax.js',
  'dist/main.js',
  'test/**/*.js'
];

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

gulp.task('bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('inlinebootstrap', ['bootstrap'], function() {
  return gulp.src('./example/*-template.html')
    .pipe(inlineSource())
    .pipe(replace(/{{(\w+)}}/g, function(match, key) {
        var replaceMap = {
          'zendeskFrameworkUrl': '/dist/main.js',
          'zendeskHost'        : 'ahrjay.zendesk.com'
        };

        return replaceMap[key];
    }))
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('-template', '');
    }))
    .pipe(gulp.dest('./example'));
})

gulp.task('test', ['build'], function() {
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
    .pipe(jshint.reporter('fail'));
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
    gutil.log('[webpack-dev-server]', 'http://localhost:1337/webpack-dev-server/dist/example/index.html');
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

gulp.task('default', ['build']);

