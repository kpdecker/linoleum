import _ from 'lodash';
import Gulp from 'gulp';
import GUtil, {PluginError, colors} from 'gulp-util';
import istanbul from 'gulp-istanbul';

import {SourceMapConsumer} from 'source-map';

import {instrumenterConfig} from '../src/cover';
import plumber from '../src/plumber';
import {runTask} from '../src/watch';

import {SOURCE_FILES, COVERAGE_TARGET, WATCHING, COMPLETE_COVERAGE} from '../index';

import {utils, Collector, Report} from 'istanbul';
import through from 'through2';

function coverSourceFiles() {
  return Gulp.src(SOURCE_FILES)
      .pipe(plumber())
      .pipe(istanbul(instrumenterConfig()));
}

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
              sourceMap = extractSourceMap(file.code),
              errors = [];

          function mapLine(line, column = 0) {
            if (sourceMap) {
              line = sourceMap.originalPositionFor({line, column, bias: SourceMapConsumer.LEAST_UPPER_BOUND}).line || line;
            }
            return parseInt(line, 10);
          }
          function formatLines(lines) {
            return lines.sort((a, b) => a - b)
                .map((line) => colors.magenta(line))
                .join(', ');
          }

          if (summary.lines.pct < 100) {
            let lines = _.compact(_.map(summary.linesCovered, (value, key) => value ? undefined : mapLine(parseInt(key, 10))));
            if (lines.length) {
              errors.push(`lines: ${formatLines(lines)}`);
            }
          }
          if (summary.statements.pct < 100) {
            let statements = _.compact(_.map(file.s, (coverage, id) => {
              if (!coverage && !file.statementMap[id].skip) {
                let {line, column} = file.statementMap[id].start;
                return mapLine(line, column);
              }
            }));
            if (statements.length) {
              errors.push(`statements: line #${formatLines(statements)}`);
            }
          }
          if (summary.functions.pct < 100) {
            let functions = _.compact(_.map(file.f, (coverage, id) => {
              if (!coverage && !file.fnMap[id].skip) {
                let {line, column} = file.fnMap[id].loc.start;
                return mapLine(line, column);
              }
            }));
            if (functions.length) {
              errors.push(`functions: line #${formatLines(functions)}`);
            }
          }
          if (summary.branches.pct < 100) {
            let branches = _.compact(_.map(file.b, (coverage, id) => {
              let branch = file.branchMap[id];
              coverage = _.map(coverage, (coverage, location) => !coverage && !branch.locations[location].skip);
              if (_.includes(coverage, true)) {
                let {line, column} = file.branchMap[id].locations[0].start;
                return mapLine(line, column);
              }
            }));
            if (branches.length) {
              errors.push(`branches: line #${formatLines(branches)}`);
            }
          }

          if (errors.length > 0) {
            return `${colors.cyan(path)}\n    ${errors.join('\n    ')}`;
          }
        }));

        if (errors.length) {
          errors = `Coverage failed:\n${errors.join('\n')}`;
        }
        if (errors.length && COMPLETE_COVERAGE) {
          this.emit('error', new PluginError({
            plugin: 'coverage',
            message: errors
          }));
        } else if (errors.length) {
          GUtil.log('[cover:report]', errors);
        }
      }
    });
});

Gulp.task('watch:cover:report', function() {
  Gulp.watch(`${COVERAGE_TARGET}/**/coverage-final.json`, function() {
    runTask('cover:report');
  });
});

function extractSourceMap(code) {
  let mappingLine = code.reduceRight((prev, current) => {
    return prev || /sourceMappingURL=data:.*base64,(.*)/.exec(current);
  }, undefined);
  if (mappingLine) {
    let decoded = JSON.parse(new Buffer(mappingLine[1], 'base64').toString());
    return new SourceMapConsumer(decoded);
  }
}
