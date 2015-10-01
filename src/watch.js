import Gulp from 'gulp';
import batch from 'gulp-batch';

import * as Index from '../index';

// A total hack, but this is basiclly what run sequence does without
// the potentially hazardous error handling logic.
// We will likely need to revisit this under Gulp 4.
export function runTask(command, done) {
  function cleanup() {
    Gulp.removeListener('task_stop', cleanup);
    Gulp.removeListener('task_err', cleanup);
    done();
  }
  Gulp.once('task_stop', cleanup);
  Gulp.once('task_err', cleanup);
  Gulp.start(command);
}

export default function(files, command, options = {}) {
  Gulp.task(`watch:${command}`, function() {
    Index.WATCHING = true;    // Enable plumber
    Gulp.watch(files, batch(options, function(events, done) {
      runTask(command, done);
    }));
    Gulp.start(command);
  });
}
