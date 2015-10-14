import Gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';

import {Instrumenter} from 'istanbul';
import {transform} from 'babel';

import plumber from '../src/plumber';

import {SOURCE_FILES, COVERAGE_TARGET, testFiles} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

Gulp.task('cover:mocha', function(done) {
  Gulp.src(SOURCE_FILES)
      .pipe(plumber(done))
      .pipe(istanbul({
        instrumenter(opts) {
          // Hack around our own instrumenter so we can execute against inline paths but still instrument
          // the transpiled code. This is necessary as ignore statements don't work in isparta right now
          // and development has stalled by a potential istanbul merge. Fun.
          let ret = new Instrumenter(opts);
          let $instrumentSync = ret.instrumentSync;
          ret.instrumentSync = function(code, filename) {
            code = transform(code, Object.assign({filename}, BABEL_DEFAULTS));
            return $instrumentSync.call(this, code.code, filename);
          };
          return ret;
        },
        embedSource: true,
        includeUntested: true,
        sourceMap: true
      }))
      .pipe(istanbul.hookRequire({extensions: ['.js', '.jsx']}))
      .on('finish', function() {
        Gulp.src(testFiles())
            .pipe(plumber(done))
            .pipe(mocha())
            .pipe(istanbul.writeReports({
              dir: COVERAGE_TARGET,
              reporters: [ 'lcov', 'json', 'text-summary' ],
              reportOpts: { dir: COVERAGE_TARGET }
            }))
            .pipe(istanbul.enforceThresholds({thresholds: {global: 100}}))
            .on('end', done);
      });
});
