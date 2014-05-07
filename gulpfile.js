var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var reactify = require('reactify');
var through = require('through');
var Compiler = require('es6-module-transpiler').Compiler;
var karma = require('gulp-karma');
var react = require('gulp-react');

function ES6ModuleCompile(opts) {
  var buf = '';
  return function () {
    return through(write, end);
  };

  function write(data) {
    buf += data;
  }

  function end() {
    this.queue((new Compiler(buf, '', opts)).toCJS());
    this.queue(null);
    buf = '';
  }
}

var testFiles = [
  'node_modules/lodash/lodash.js',
  'node_modules/es5-shim/es5-shim.js',
  'node_modules/jasmine-ajax/lib/mock-ajax.js',
  'dist/main.js',
  'test/**/*.js'
];

gulp.task('build', ['lint'], function() {
  return gulp.src('src/main.js')
    .pipe(browserify({
      transform: [reactify, ES6ModuleCompile()]
    }))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

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
    .pipe(gulp.dest('lint_build/'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

gulp.task('default', ['build']);

