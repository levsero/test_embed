var gulp = require('gulp'),
    inlineSource = require('gulp-inline-source'),
    runSequence = require('run-sequence'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename');

gulp.task('bootstrap:inline', function() {
  return gulp.src('./example/*-template.html')
    .pipe(inlineSource())
    .pipe(replace(/{{(\w+)}}/g, function(match, key) {
        var replaceMap = {
          'zendeskFrameworkUrl': '/dist/main.js',
          'zendeskHost'        : 'dev.zd-dev.com'
        };

        return replaceMap[key];
    }))
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('-template', '');
    }))
    .pipe(gulp.dest('./example'));
});

gulp.task('bootstrap', function(callback) {
  runSequence('build:bootstrap', 'bootstrap:inline', callback);
});

