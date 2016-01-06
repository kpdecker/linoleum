import Gulp from 'gulp';
import del from 'del';

import {BUILD_TARGET, COVERAGE_TARGET, WATCHING} from '../index';

let ran = false;
Gulp.task('clean', function(done) {
  if (!WATCHING || !ran) {
    ran = true;
    clean(done);
  } else {
    done();
  }
});

Gulp.task('clean:always', clean);

function clean(done) {
  del(WATCHING ? [BUILD_TARGET] : [BUILD_TARGET, COVERAGE_TARGET])
    .then(() => done(), done);
}
