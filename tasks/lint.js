import Gulp from 'gulp';
import changed from 'gulp-changed';
import eslint from 'gulp-eslint';
import plumber from '../src/plumber';

import {jsFiles, BUILD_TARGET} from '../index';

import {changeMonitors} from '../src/watch';

let fileCache = {};
changeMonitors.on('change', (changed) => {
  changed.forEach((change) => {
    delete fileCache[change.path];
  });
});

Gulp.task('lint', function() {
  return Gulp.src(jsFiles())
      .pipe(plumber())
      .pipe(changed(BUILD_TARGET, {
        hasChanged(stream, callback, sourceFile) {
          let modified = fileCache[sourceFile.path];
          if (!modified || modified < sourceFile.stat.mtime) {
            stream.push(sourceFile);
            fileCache[sourceFile.path] = sourceFile.stat.mtime;
          }
          callback();
        }
      }))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
