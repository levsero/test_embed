var gulp = require('gulp');
var inlineSource = require('gulp-inline-source');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

gulp.task('bootstrap', function() {
  return gulp.src('src/bootstrap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});


gulp.task('inlinebootstrap', ['bootstrap'], function() {
  return gulp.src('./example/*-template.html')
    .pipe(inlineSource())
    .pipe(replace(/{{(\w+)}}/g, function(match, key) {
        var replaceMap = {
          'zendeskFrameworkUrl': '/dist/main.js',
          'zendeskHost'        : 'ahrjay.zendesk.com'
        };

        return replaceMap[key];
    }))
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('-template', '');
    }))
    .pipe(gulp.dest('./example'));
});

