import Gulp from 'gulp';
import {Server} from 'karma';

Gulp.task('karma', function(done) {
  new Server({
    configFile: `${__dirname}/../src/karma.js`,
    singleRun: true
  }, done).start();
});

Gulp.task('karma-watch', function(done) {
  new Server({
    configFile: `${__dirname}/../src/karma.js`
  }, done).start();
});
