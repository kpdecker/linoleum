import Gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from '../src/plumber';

import {SOURCE_FILES, BUILD_TARGET} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

Gulp.task('babel', function() {
  return Gulp.src(SOURCE_FILES)
      .pipe(plumber())
      .pipe(babel(BABEL_DEFAULTS))
      .pipe(Gulp.dest(BUILD_TARGET));
});
