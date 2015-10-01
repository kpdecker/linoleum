import Gulp from 'gulp';
import mocha from 'gulp-mocha';
import plumber from '../src/plumber';

import {testFiles} from '../index';

Gulp.task('test:mocha', function() {
  return Gulp.src(testFiles())
      .pipe(plumber())
      .pipe(mocha());
});
