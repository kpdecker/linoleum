import _ from 'lodash';
import Gulp from 'gulp';
import {PluginError} from 'gulp-util';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';

import {Instrumenter, utils} from 'istanbul';
import {transform} from 'babel-core';

import plumber from '../src/plumber';
import {runTask} from '../src/watch';

import {SOURCE_FILES, COVERAGE_TARGET, WATCHING, testFiles} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

import {Collector, Report} from 'istanbul';
import through from 'through2';

function coverSourceFiles() {
  return Gulp.src(SOURCE_FILES)
      .pipe(plumber())
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
      }));
}

// This task hierarchy is to hack around
// https://github.com/sindresorhus/gulp-mocha/issues/112
Gulp.task('cover:mocha:pre', function() {
  return coverSourceFiles()
      .pipe(istanbul.hookRequire({extensions: ['.js', '.jsx']}));
});
Gulp.task('cover:mocha:run', ['cover:mocha:pre'], function() {
  return Gulp.src(testFiles())
      .pipe(plumber())
      .pipe(mocha());
});
Gulp.task('cover:mocha', ['cover:mocha:run'], function() {
  return Gulp.src(testFiles())
      .pipe(istanbul.writeReports({
        dir: COVERAGE_TARGET,
        reporters: [ 'json' ],
        reportOpts: { dir: `${COVERAGE_TARGET}/mocha` }
      }));
});

// Bit of a hack, but lets us ensure that all source files are included
// in the coverage report.
Gulp.task('cover:untested', function() {
  return coverSourceFiles()
      .pipe(istanbul.writeReports({
        dir: COVERAGE_TARGET,
        reporters: [ 'json' ],
        reportOpts: { dir: `${COVERAGE_TARGET}/untested` }
      }));
});

Gulp.task('cover:report', function() {
  let collector = new Collector();

  return Gulp.src(`${COVERAGE_TARGET}/**/coverage-final.json`)
    .pipe(through.obj(function(file, enc, cb) {
      try {
        collector.add(JSON.parse(file.contents.toString()));
      } catch (err) {
        if (WATCHING) {
          // We can get into an out of sync state where only one set of coverage
          // files are updated and the state doesn't match up, cauing istanbul to
          // blow up. We are ignoring this case and assuming that once the other
          // coverage process completes we will return to a consistent state in
          // the report.
          return;
        } else {
          throw err;
        }
      }

      cb();
    }))
    .on('finish', function() {
      let report = Report.create('lcov', {dir: COVERAGE_TARGET});
      try {
        report.writeReport(collector, true);
      } catch (err) {
        if (WATCHING) {
          // We can get into an out of sync state where only one set of coverage
          // files are updated and the state doesn't match up, cauing istanbul to
          // blow up. We are ignoring this case and assuming that once the other
          // coverage process completes we will return to a consistent state in
          // the report.
          return;
        } else {
          throw err;
        }
      }

      report = Report.create('text-summary');
      report.writeReport(collector, true);

      if (!WATCHING) {
        let errors = _.compact(_.map(collector.getFinalCoverage(), (file, path) => {
          let summary = utils.summarizeFileCoverage(file),
              errors = [];

          if (summary.lines.pct < 100) {
            let lines = _.compact(_.map(summary.linesCovered, (value, key) => value ? undefined : key));
            if (lines.length) {
              errors.push(`lines: ${lines.join(', ')}`);
            }
          }
          if (summary.statements.pct < 100) {
            let statements = _.compact(_.map(file.s, (coverage, id) => {
              if (!coverage && !file.statementMap[id].skip) {
                return file.statementMap[id].start.line;
              }
            }));
            if (statements.length) {
              errors.push(`statements: line #${statements.join(', ')}`);
            }
          }
          if (summary.functions.pct < 100) {
            let functions = _.compact(_.map(file.f, (coverage, id) => {
              if (!coverage && !file.fnMap[id].skip) {
                return file.fnMap[id].line;
              }
            }));
            if (functions.length) {
              errors.push(`functions: line #${functions.join(', ')}`);
            }
          }
          if (summary.branches.pct < 100) {
            let branches = _.compact(_.map(file.b, (coverage, id) => {
              let branch = file.branchMap[id];
              coverage = _.map(coverage, (coverage, location) => !coverage && !branch.locations[location].skip);
              if (_.includes(coverage, true)) {
                return file.branchMap[id].line;
              }
            }));
            if (branches.length) {
              errors.push(`branches: line #${branches.join(', ')}`);
            }
          }

          if (errors.length > 0) {
            return `${path}\n    ${errors.join('\n    ')}`;
          }
        }));

        if (errors.length) {
          this.emit('error', new PluginError({
            plugin: 'coverage',
            message: `Coverage failed (line numbers are post-transpiler):\n${errors.join('\n')}`
          }));
        }
      }
    });
});

Gulp.task('watch:cover:report', function() {
  Gulp.watch(`${COVERAGE_TARGET}/**/coverage-final.json`, function() {
    runTask('cover:report');
  });
});
