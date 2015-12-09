const gulp = require('gulp');
const karma = require('gulp-karma');
const runSequence = require('run-sequence');
const shell = require('gulp-shell');
const prefix = process.cwd();
const testFiles = [
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

gulp.task('test-spec', function(callback) {
  runSequence(
    'build:prod',
    'test:spec',
    callback
  );
});

gulp.task('test-ui', shell.task(
  'node_modules/.bin/jasmine-node test/ui/ --verbose'
));

