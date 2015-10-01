import Gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from '../src/plumber';

import {jsFiles} from '../index';

Gulp.task('lint', function() {
  return Gulp.src(jsFiles())
      .pipe(plumber())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
