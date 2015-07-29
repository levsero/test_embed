const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');

gulp.task('lint', function() {
  gulp.src(['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'])
    .pipe(jshint({linter: require('jshint-jsx').JSXHINT}))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'])
    .pipe(jscs());
});
