import karmaWebpack from 'karma-webpack';
import karmaSourcemap from 'karma-sourcemap-loader';
import karmaMocha from 'karma-mocha';
import karmaSinon from 'karma-sinon';
import karmaChrome from 'karma-chrome-launcher';
import karmaFirefox from 'karma-firefox-launcher';
import karmaCoverage from 'karma-coverage';
import karmaMochaReporter from 'karma-mocha-reporter';
import loadWebpackConfig from './webpack';

import {resolve} from 'path';

let sourceFile = `${__dirname}/karma-index.js`;

module.exports = function(config) {
  let webpack = loadWebpackConfig();
  webpack.devtool = 'inline-source-map';

  // We only need the test asset here
  delete webpack.entry;

  webpack.module.postLoaders = [{
    test: /\.js$/,
    exclude: /(test|node_modules|linoleum\/src)\//,
    loader: require.resolve('istanbul-instrumenter-loader')
  }];

  config.set({
    browsers: [process.env.KARMA_BROWSER || 'Chrome'],    // eslint-disable-line no-process-env
    reporters: ['mocha', 'coverage'],

    files: [
      sourceFile
    ],

    preprocessors: {
      [sourceFile]: ['webpack', 'sourcemap']
    },

    webpack,

    webpackMiddleware: {
      noInfo: true
    },

    coverageReporter: {
      type: 'json',
      dir: resolve('coverage/karma/')
    },

    plugins: [
      karmaWebpack,
      karmaSourcemap,
      karmaMocha,
      karmaSinon,
      karmaChrome,
      karmaFirefox,
      karmaCoverage,
      karmaMochaReporter
    ],
    frameworks: [
      'mocha',
      'sinon'
    ]
  });
};
