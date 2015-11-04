Error.stackTraceLimit = Infinity;   // And beyond

require('babel/register')(require('./babel-defaults'));

// Must be after babel so our fork overrides the one installed by babel.
// Aren't unresponsive OSS projects fun!.
require('source-map-support').install({
  handleUncaughtExceptions: false,
  hookRequire: true
});
