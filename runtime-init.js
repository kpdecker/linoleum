/* eslint-disable no-process-env */
var Path = require('path');

Error.stackTraceLimit = Infinity;   // And beyond

if (!process.env.BABEL_CACHE_PATH) {
  process.env.BABEL_CACHE_PATH = Path.resolve('./.babel.cache.json');
}

require('babel-core/register')(require('./babel-defaults'));

// Must be after babel so our fork overrides the one installed by babel.
// Aren't unresponsive OSS projects fun!.
require('source-map-support').install({
  environment: 'node',
  handleUncaughtExceptions: false,
  hookRequire: true
});
