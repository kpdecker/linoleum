import Gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from '../src/plumber';

import {SOURCE_FILES, TEST_FILES} from '../index';

Gulp.task('lint', function() {
  return Gulp.src(SOURCE_FILES.concat(TEST_FILES))
      .pipe(plumber())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
