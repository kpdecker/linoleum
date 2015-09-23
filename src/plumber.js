import GUtil from 'gulp-util';
import plumber from 'gulp-plumber';
import {WATCHING} from '../index';

export default function(done) {
  return plumber({
    // Need to special case this here to ensure that we successfully complete the
    // task should we have an error in the mocha init section.
    errorHandler: WATCHING && function(err) {
      GUtil.log(
        GUtil.colors.cyan('Plumber') + GUtil.colors.red(' found unhandled error:\n'),
        err.toString());
      if (done && err.plugin === 'gulp-mocha' && err.showStack) {
        done();
      }
    }
  });
}
