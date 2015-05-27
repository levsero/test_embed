var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function() {
  gulp.src(['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'])
    .pipe(jshint({linter: require('jshint-jsx').JSXHINT}))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

