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

var DieReporter = function() {
  var failureCount;
  this.jasmineStarted = function(specInfo) {
    failureCount = 0;
  };
  this.jasmineDone = function() {
    if (failureCount != 0) {
//      console.log('exit(1)');
      process.exit(1);
    }
  };
  this.specDone = function(result) {
    if (result.status == 'failed') failureCount++;
  }
};

gulp.task('test:unit', function() {
  return gulp.src([
    'build/test/unit/**/*.js',
    '!build/test/unit/component/*.js',
    'build/test/unit/embed/*.js',
    'build/test/unit/embed/frameFactory_test.js',
//    '!build/test/unit/service/*.js',
//    'build/test/unit/util/*.js'
])
    .pipe(gulpJasmine({
      verbose:true,
      includeStackTrace: true,
      reporter: [new DieReporter()]
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

