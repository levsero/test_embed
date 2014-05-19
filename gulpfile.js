var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var react = require('gulp-react');
var es6ModuleTranspiler = require('gulp-es6-module-transpiler');
var jasmine = require('gulp-jasmine');
var jsdom = require('jsdom');
var _ = require('lodash');

var testFiles = [
  'node_modules/lodash/lodash.js',
  'node_modules/es5-shim/es5-shim.js',
  'node_modules/jasmine-ajax/lib/mock-ajax.js',
  'dist/main.js'
];

var componentTestFiles = [
   'test/helpers/react-with-addons.js',
   'test/jsx_spec/*.js'
];

var servicesTestFiles = [
   'test/spec/**/*',
   '!test/spec/components/*'
];

gulp.task('unes6module', function() {
  return gulp.src(['src/**/*.js', 'test/helpers/react-with-addons.js'])
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(gulp.dest('build/unes6'));
});

gulp.task('testcomponents', ['unes6module', 'build_jsx'], function() {
  return gulp.src(['test/jsx_spec/*.js' ])
    .pipe(jasmine());
});

gulp.task('build', ['bootstrap'], function(callback) {
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

gulp.task('test-services', ['build'], function() {
  return gulp.src(_.union(testFiles, servicesTestFiles))
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('test-components', ['build_jsx'], function() {
  return gulp.src(componentTestFiles)
    .pipe(jasmine())
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('build_jsx', function() {
  return gulp.src('./test/spec/component/*_spec.js')
     .pipe(react())
     .on('error', function(err) {
       throw err;
     })
     .pipe(gulp.dest('./test/jsx_spec/'))
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
    gutil.log('[webpack-dev-server]', 'http://localhost:1337/webpack-dev-server/example/index.html');
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

gulp.task('test', ['test-services', 'test-components'])
gulp.task('default', ['build']);

