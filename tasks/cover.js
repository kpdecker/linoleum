import _ from 'lodash';
import Gulp from 'gulp';
import {PluginError} from 'gulp-util';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';

import {Instrumenter, utils} from 'istanbul';
import {transform} from 'babel';
import {Server as KarmaServer} from 'karma';

import plumber from '../src/plumber';
import {runTask} from '../src/watch';

import {SOURCE_FILES, COVERAGE_TARGET, WATCHING, testFiles} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

import {Collector, Report} from 'istanbul';
import through from 'through2';

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
              reporters: [ 'json' ],
              reportOpts: { dir: `${COVERAGE_TARGET}/mocha` }
            }))
            .on('end', done);
      });
});

Gulp.task('cover:karma', function(done) {
  new KarmaServer({
    configFile: `${__dirname}/../src/karma.js`,
    singleRun: true
  }, done).start();
});

Gulp.task('cover:report', function(done) {
  let collector = new Collector();

  Gulp.src(`${COVERAGE_TARGET}/**/coverage-final.json`)
    .pipe(through.obj(function(file, enc, cb) {
      collector.add(JSON.parse(file.contents.toString()));

      cb();
    }))
    .on('finish', function() {
      let report = Report.create('lcov', {dir: COVERAGE_TARGET});
      report.writeReport(collector, true);

      report = Report.create('text-summary');
      report.writeReport(collector, true);

      if (!WATCHING) {
        let errors = _.compact(_.map(collector.getFinalCoverage(), (file, path) => {
          let summary = utils.summarizeFileCoverage(file),
              errors = [];

          if (summary.lines.pct < 100) {
            let lines = _.concat(_.map(summary.linesCovered, (value, key) => value ? undefined : key));
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
            message: `Coverage failed:\n${errors.join('\n')}`
          }));
        }
      }

      done();
    });
});

Gulp.task('watch:cover:report', function() {
  Gulp.watch(`${COVERAGE_TARGET}/**/coverage-final.json`, function() {
    runTask('cover:report');
  });
});
