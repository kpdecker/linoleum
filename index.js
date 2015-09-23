// Config values. May be overriden prior to tasks executing.
module.exports.WATCHING = false;

module.exports.SOURCE_FILES = ['src/**/*.{js,jsx}'];
module.exports.TEST_FILES = ['test/**/*.js'];

Error.stackTraceLimit = Infinity;   // And beyond

require('babel/register');

// Must be after babel so our fork overrides the one installed by babel.
// Aren't unresponsive OSS projects fun!.
require('source-map-support').install({
  handleUncaughtExceptions: false,
  hookRequire: true
});
