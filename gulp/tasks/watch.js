var gulp = require('gulp');

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.js'], ['build']);
  gulp.watch(['test/**/*.js'], ['test']);
});

