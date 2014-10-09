var gulp = require('gulp'),
    karma = require('gulp-karma'),
    gulpJasmine = require('gulp-jasmine'),
    runSequence = require('run-sequence'),
    prefix = process.cwd(),
    testFiles = [
      prefix + '/node_modules/lodash/lodash.js',
      prefix + '/node_modules/es5-shim/es5-shim.js',
      prefix + '/node_modules/jasmine-ajax/lib/mock-ajax.js',
      prefix + '/test/spec/boot.js',
      prefix + '/dist/main.js',
      prefix + '/test/spec/*.js'
    ];

gulp.task('test:spec', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('test:unit', function() {
  return gulp.src('build/test/unit/**/*.js')
    .pipe(gulpJasmine({
      verbose: true,
      includeStackTrace: true
    }));
});

gulp.task('test', function(callback) {
  runSequence(
    'build:src',
    'build:test',
    'test:unit',
    callback
  );
});

gulp.task('test-spec', function(callback) {
  runSequence(
    'build:prod',
    'test:spec',
    callback
  );
});

