import Gulp from 'gulp';

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
    let running = false,
        rerun = false;

    Index.WATCHING = true;    // Enable plumber
    Gulp.watch(files, function watcher() {
      if (running) {
        rerun = true;
        return;
      }

      running = true;
      setTimeout(function() {
        // Ignore any rerun requests that occur in the cooldown
        // period.
        rerun = false;

        runTask(command, function() {
          running = false;
          if (rerun) {
            rerun = false;
            process.nextTick(watcher);
          }
        });
      }, options.timeout || 100);
    });

    if (options.setup) {
      runTask(options.setup, function() {
        Gulp.start(command);
      });
    } else {
      Gulp.start(command);
    }
  });
}
