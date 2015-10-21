import Gulp from 'gulp';
import del from 'del';

import {BUILD_TARGET, COVERAGE_TARGET, WATCHING} from '../index';

Gulp.task('clean', function(done) {
  del(WATCHING ? [BUILD_TARGET] : [BUILD_TARGET, COVERAGE_TARGET])
    .then(() => done(), done);
});
