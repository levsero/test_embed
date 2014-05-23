var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('clean', function() {
  gulp.src(['build', 'dist', 'example/*.html', '!example/*-template.html'], { read: false })
    .pipe(clean());
});
