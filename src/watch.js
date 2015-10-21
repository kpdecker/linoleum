import Gulp from 'gulp';
import batch from 'gulp-batch';

import * as Index from '../index';

// A total hack, but this is basiclly what run sequence does without
// the potentially hazardous error handling logic.
// We will likely need to revisit this under Gulp 4.
export function runTask(command, done) {
  if (!Array.isArray(command)) {
    command = [command];
  } else {
    command = command.slice();
  }

  let waitingFor;
  function run({task}) {
    if (task !== waitingFor) {
      return;
    }

    if (command.length) {
      waitingFor = command.shift();
      Gulp.start(waitingFor);
    } else {
      cleanup();
    }
  }
  function cleanup() {
    Gulp.removeListener('task_stop', run);
    Gulp.removeListener('task_err', cleanup);
    if (done) {
      done();
    }
  }
  Gulp.on('task_stop', run);
  Gulp.on('task_err', cleanup);
  run({});
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
