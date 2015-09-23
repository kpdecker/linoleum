import Gulp from 'gulp';
import mocha from 'gulp-mocha';
import plumber from '../src/plumber';

import {TEST_FILES} from '../index';

Gulp.task('test:mocha', function() {
  return Gulp.src(TEST_FILES)
      .pipe(plumber())
      .pipe(mocha());
});
