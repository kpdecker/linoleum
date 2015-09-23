import Gulp from 'gulp';
import del from 'del';

import {BUILD_TARGET} from '../index';

Gulp.task('clean', function(done) {
  del([BUILD_TARGET, 'coverage/'], done);
});
