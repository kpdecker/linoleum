import Gulp from 'gulp';
import batch from 'gulp-batch';
import runSequence from 'run-sequence';

import * as Index from '../index';

export default function(files, command) {
  Gulp.task(`watch:${command}`, function() {
    Index.WATCHING = true;    // Enable plumber
    Gulp.watch(files, batch(function(events, done) {
      runSequence(command, done);
    }));
    Gulp.start(command);
  });
}
