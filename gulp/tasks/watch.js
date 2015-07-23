const gulp = require('gulp');
const path = require('path');
const lr = require('tiny-lr');
const express = require('express');
const connectlr = require('connect-livereload');
const gutil = require('gulp-util');
const server = lr();
const EXPRESS_PORT = 1337;
const ROOT = process.cwd();
const LIVERELOAD_PORT = 35729;

function startExpress() {
  var app = express();

  app.use(connectlr());
  app.use(express.static(ROOT));
  app.listen(EXPRESS_PORT);
}

function startLR() {
  server.listen(LIVERELOAD_PORT);
}

function pingLR(event) {
  var fileName = path.relative(ROOT, event.path);

  server.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', ['build-dev'], function() {
  startExpress();
  startLR();
  gulp.watch(['src/**/*', 'example/**/*'], ['build-dev']);
  gulp.watch('dist/main.js').on('change', pingLR);

  gutil.log('[server started]', 'http://localhost:' + EXPRESS_PORT + '/example/index.html');
});

