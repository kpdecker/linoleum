import Gulp from 'gulp';
import {Server} from 'karma';

Gulp.task('watch:karma', function(done) {
  new Server({
    configFile: `${__dirname}/../src/karma.js`
  }, function() {
  }).start();
  done();
});
