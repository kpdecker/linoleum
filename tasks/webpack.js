import Gulp from 'gulp';
import GUtil from 'gulp-util';
import webpack from 'webpack';

import loadWebpackConfig from '../src/webpack';

Gulp.task('webpack', function(done) {
  webpack(loadWebpackConfig(), function(err, stats) {
      if (err) {
        throw new GUtil.PluginError('webpack', err);
      }
      GUtil.log('[webpack]', stats.toString({
          // output options
      }));
      done();
  });
});
