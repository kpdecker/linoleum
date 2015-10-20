import Gulp from 'gulp';
import GUtil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import {SERVER_PORT, DEV_SERVER_PORT} from '../index';
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

Gulp.task('webpack:dev-server', function(done) {
  let config = loadWebpackConfig(),
      devServer = `http://localhost:${DEV_SERVER_PORT}/`;
  config.entry.unshift(
    `${require.resolve('webpack-dev-server/client')}?${devServer}`,
    require.resolve(`webpack/hot/only-dev-server`)
  );
  config.plugins.unshift(
    new webpack.HotModuleReplacementPlugin()
  );

  config.output.path = '/static/';
  config.output.publicPath = `${devServer}static/`;

  config.module.loaders.forEach((loader) => {
    if (loader.babel) {
      loader.query.plugins = loader.query.plugins.concat(
        require.resolve('babel-plugin-react-transform'));
      loader.query.extra = {
        'react-transform': {
          transforms: [{
            transform: require.resolve('react-transform-hmr'),
            imports: ['react'],
            locals: ['module']
          }]
        }
      };
    }
  });

  let server = new WebpackDevServer(webpack(config), {
    // webpack-dev-server options
    contentBase: 'http://localhost:3000/',

    hot: true,
    proxy: {
      '*': `http://localhost:${SERVER_PORT}`
    },

    // webpack-dev-middleware options
    // NOTE: We can not use lazy here as this conflicts with the proxy
    lazy: false,
    quiet: false,
    noInfo: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: '/static/',
    stats: {
      colors: true,
      chunks: false,
      version: false
    }
  });
  server.listen(DEV_SERVER_PORT, 'localhost', function() {
    console.log(`Dev server listening on ${devServer}`);
    done();
  });
});
