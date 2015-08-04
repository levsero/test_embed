const gulp = require('gulp');
const runSequence = require('run-sequence');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');

const files = [
  'src/**/*.js',
  'test/**/*.js',
  'gulp/**/*.js'
];

gulp.task('lint', function(callback) {
  runSequence(
    'jshint',
    'jscs',
    callback
  );
});

gulp.task('jshint', function() {
  return gulp.src(files)
    .pipe(jshint({linter: require('jshint-jsx').JSXHINT}))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(files)
    .pipe(jscs());
});
