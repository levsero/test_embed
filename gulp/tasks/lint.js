var gulp = require('gulp');
var react = require('gulp-react');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

