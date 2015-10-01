var Gulp = require('gulp'),
    runSequence = require('run-sequence'),

    Linoleum = require('./index');

require('./tasks/clean');
require('./tasks/lint');
require('./tasks/babel');
require('./tasks/test');
require('./tasks/cover');

Gulp.task('build', function(done) {
  runSequence(['clean', 'lint'], 'babel', done);
});
Gulp.task('test', ['build'], function(done) {
  runSequence('test:mocha', done);
});
Gulp.task('cover', ['build'], function(done) {
  runSequence('cover:mocha', done);
});

Linoleum.watch(Linoleum.jsFiles(), 'cover');

Gulp.task('travis', function(done) {
  // These need to be run in series to prevent issues with error tracking
  runSequence('cover', 'test', done);
});
Gulp.task('default', ['cover']);

