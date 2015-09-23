// Config values. May be overriden prior to tasks executing.
module.exports.WATCHING = false;

module.exports.SOURCE_FILES = ['src/**/*.{js,jsx}'];
module.exports.TEST_FILES = [__dirname + '/src/sandbox.js', 'test/**/*.js'];    // eslint-disable-line prefer-template

module.exports.BUILD_TARGET = 'lib/';
module.exports.COVERAGE_TARGET = './coverage';

// Hack around es6 module definitions without bootstrapping the transpiler
module.exports.__esModule = true;

Error.stackTraceLimit = Infinity;   // And beyond

require('babel/register')(require('./babel-defaults'));

// Must be after babel so our fork overrides the one installed by babel.
// Aren't unresponsive OSS projects fun!.
require('source-map-support').install({
  handleUncaughtExceptions: false,
  hookRequire: true
});

module.exports.watch = require('./src/watch');
