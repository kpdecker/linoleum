import Gulp from 'gulp';
import GUtil from 'gulp-util';
import webpack from 'webpack';

import {CLIENT_ENTRY, BUILD_TARGET} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

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

function loadWebpackConfig() {
  let ret = {
    entry: CLIENT_ENTRY,
    output: {
      path: `${BUILD_TARGET}/$client$/`,
      publicPath: '/static/'
    },


    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: `${require.resolve('babel-loader')}?${mapBabelOptions(BABEL_DEFAULTS)}`,
          exclude: /(node_modules|bower_components)/
        }
      ]
    },

    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.jsx', '.js']
    },
    devTool: 'eval'
  };

  // Strip development code
  if (process.env.NODE_ENV === 'production') {    // eslint-disable-line no-process-env
    ret.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        mangle: true
      })
    ];
  }

  return ret;
}

function mapBabelOptions(options) {
  return Object.keys(options).map((key) => {
    let value = options[key];
    if (Array.isArray(key)) {
      return value.map((value) => `${key}[]=${value}`).join('&');
    } else {
      return `${key}=${value}`;
    }
  }).join('&');
}
