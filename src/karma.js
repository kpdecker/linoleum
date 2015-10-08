import karmaWebpack from 'karma-webpack';
import karmaMocha from 'karma-mocha';
import karmaSinon from 'karma-sinon';
import loadWebpackConfig from './webpack';

let sourceFile = `${__dirname}/karma-index.js`;

module.exports = function(config) {
  config.set({
    // ... normal karma configuration

    files: [
      // all files ending in "_test"
      sourceFile
    ],

    preprocessors: {
      // add webpack as preprocessor
      [sourceFile]: ['webpack']
    },

    webpack: loadWebpackConfig(),

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },

    plugins: [
      karmaWebpack,
      karmaMocha,
      karmaSinon
    ],
    frameworks: [
      'mocha',
      'sinon'
    ]
  });
};
