import webpack from 'webpack';

import {CLIENT_ENTRY, BUILD_TARGET} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

export default function() {
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
        },

        {
          test: /\/sinon\/.*\.js$/,
          loader: `${require.resolve('imports-loader')}?define=>false`
        }
      ]
    },

    externals: {
      sinon: 'sinon'
    },

    resolve: {
      alias: {
        project: process.cwd()
      },
      extensions: ['', '.webpack.js', '.web.js', '.jsx', '.js']
    },
    devTool: 'eval'
  };

  // Strip development code
  if (process.env.NODE_ENV === 'production') {    // eslint-disable-line no-process-env
    ret.plugins = [
      new webpack.NoErrorsPlugin(),
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
  } else {
    ret.plugins = [
      new webpack.NoErrorsPlugin()
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
