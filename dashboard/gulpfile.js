var gulp = require('gulp');
var browserify = require('browserify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');

//watch task - watches all javascript files including subdirectories
gulp.task('watch', function() {
	gulp.watch(['client/**/*.js', '!client/bundle.js'], ['build']);
});

//build process, generates bundle.js within client/bundle.js
gulp.task('build', function() {
  var bundleStream = browserify('./client/app.js').bundle();
 
  bundleStream
    .pipe(source('app.js'))
    //.pipe(streamify(uglify()))
    .pipe(rename('client/bundle.js'))
    .pipe(gulp.dest('./'));
});

//default task configured to run watch task
gulp.task('default', ['watch']);