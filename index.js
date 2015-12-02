// Config values. May be overriden prior to tasks executing.
module.exports.WATCHING = false;

module.exports.SOURCE_FILES = ['src/**/*.{js,jsx}'];
module.exports.TEST_FILES = [__dirname + '/src/sandbox.js', 'test/**/*.js'];    // eslint-disable-line prefer-template

module.exports.BUILD_TARGET = 'lib/';
module.exports.COVERAGE_TARGET = './coverage';

// Hack around es6 module definitions without bootstrapping the transpiler
module.exports.__esModule = true;

require('./runtime-init');

module.exports.watch = require('./src/watch').default;
module.exports.runTask = require('./src/watch').runTask;

module.exports.jsFiles = function() {
  return module.exports.SOURCE_FILES.concat(
      module.exports.TEST_FILES);
};

module.exports.testFiles = function() {
  return module.exports.TEST_FILES;
};
