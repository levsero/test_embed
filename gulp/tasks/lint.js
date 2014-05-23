var gulp = require('gulp'),
    react = require('gulp-react'),
    jshint = require('gulp-jshint');

gulp.task('lint', function() {
  gulp.src(['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

