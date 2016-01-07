import Gulp from 'gulp';
import {PluginError} from 'gulp-util';
import {EventEmitter} from 'events';

import * as Config from '../config';

export let changeMonitors = new EventEmitter();

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
  function cleanup(err) {
    Gulp.removeListener('task_stop', run);
    Gulp.removeListener('task_err', cleanup);
    if (done) {
      /* istanbul ignore next : Difficult to test within gulp runner as it errors the test. Should provide better mock environment later */
      done(err && err.err ? new PluginError('runTask', `Dependent task, ${waitingFor}, failed`) : undefined);
    }
  }
  Gulp.on('task_stop', run);
  Gulp.on('task_err', cleanup);
  run({});
}

export default function(files, command, options = {}) {
  Gulp.task(`watch:${command}`, function() {
    let running = false,
        rerun = false,
        changed = [];

    Config.WATCHING = true;    // Enable plumber
    Gulp.watch(files, function watcher(event) {
      if (event) {
        changed.push(event);
      }

      if (running) {
        rerun = true;
        return;
      }

      if (options.onChange) {
        options.onChange(changed);
      }
      changeMonitors.emit('change', changed);
      changed = [];

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
