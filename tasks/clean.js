import Gulp from 'gulp';
import del from 'del';

import {BUILD_TARGET, COVERAGE_TARGET} from '../index';

Gulp.task('clean', function(done) {
  del([BUILD_TARGET, COVERAGE_TARGET], done);
});
