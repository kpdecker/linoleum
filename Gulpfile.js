var Gulp = require('gulp'),

    Linoleum = require('./index');

require('@kpdecker/linoleum-node');

Gulp.task('build', ['clean', 'lint'], function(done) {
  Linoleum.runTask('babel', done);
});
Gulp.task('test', ['build'], function(done) {
  Linoleum.runTask('test:mocha', done);
});
Gulp.task('cover', ['build'], function(done) {
  Linoleum.runTask(['cover:mocha', 'cover:report'], done);
});

Linoleum.watch(Linoleum.jsFiles(), 'cover');

Gulp.task('travis', function(done) {
  // These need to be run in series to prevent issues with error tracking
  Linoleum.runTask(['cover', 'test'], done);
});
Gulp.task('default', ['cover']);

require('./Gulpfile.local');
