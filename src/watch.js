import Gulp from 'gulp';

import * as Index from '../index';

export default function(files, command) {
  Gulp.task(`watch:${command}`, function() {
    Index.WATCHING = true;    // Enable plumber
    Gulp.watch(files, [command]);
    Gulp.start(command);
  });
}
