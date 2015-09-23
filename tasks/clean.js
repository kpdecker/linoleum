import Gulp from 'gulp';
import del from 'del';

Gulp.task('clean', function(done) {
  del(['lib/', 'coverage/'], done);
});
