var gulp = require('gulp');
var karma = require('gulp-karma');
var react = require('gulp-react');
var jasmine = require('gulp-jasmine');


var prefix = process.cwd(),
    testFiles = [
      prefix + '/node_modules/lodash/lodash.js',
      prefix + '/node_modules/es5-shim/es5-shim.js',
      prefix + '/node_modules/jasmine-ajax/lib/mock-ajax.js',
      prefix + '/test/spec/boot.js',
      prefix + '/dist/main.js',
      prefix + '/test/spec/*.js'
    ];

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

gulp.task('build:test', function() {
  var es6ModuleTranspiler = require('gulp-es6-module-transpiler');

  gulp.src(['test/**/*.js'])
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(gulp.dest('build/test'));
});

gulp.task('build:src', function() {
  // defined in here because defining globally breaks webpack's es6-loader
  var es6ModuleTranspiler = require('gulp-es6-module-transpiler');
  return gulp.src('src/**/*.js')
    .pipe(react())
    .pipe(es6ModuleTranspiler({type: 'cjs'}))
    .pipe(gulp.dest('build/src'));
});


gulp.task('test:unit',['build:src', 'build:test'], function() {
  return gulp.src('build/test/unit/**/*.js')
    .pipe(jasmine());
});

