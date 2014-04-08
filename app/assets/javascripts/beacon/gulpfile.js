var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var through = require('through');
var Compiler = require('es6-module-transpiler').Compiler;

function compile(opts) {
    var buf = '';
    return function () {
        return through(write, end);
    };

    function write(data) {
        buf += data;
    }

    function end() {
        this.queue((new Compiler(buf, '', opts)).toCJS());
        this.queue(null);
        buf = '';
    }
}

gulp.task('default', ['lint'], function() {
    gulp.src('src/main.js')
        .pipe(browserify({
            transform: [compile()],
            standalone: 'Zd'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
    gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
