var gulp = require('gulp'),
    rimraf = require('gulp-rimraf');

gulp.task('clean', function() {
  gulp.src([
      'build/*',
      'dist/*',
      'example/*.html',
      '!example/*-template.html'
    ], { read: false })
    .pipe(rimraf());
});
