var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var through = require('through');
var Compiler = require('es6-module-transpiler').Compiler;
var karma = require('gulp-karma');

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
  'dist/main.js',
  'test/**/*.js'
];

gulp.task('build', ['lint'], function() {
  return gulp.src('src/main.js')
    .pipe(browserify({
      transform: [ES6ModuleCompile()]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
})

gulp.task('lint', function() {
  gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

gulp.task('default', ['build']);

