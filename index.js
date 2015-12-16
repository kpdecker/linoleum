module.exports = require('./config');

require('./runtime-init');

module.exports.watch = require('./src/watch').default;
module.exports.runTask = require('./src/watch').runTask;

// Hack around dependency tree issues when trying to self-test with linoleum-node.
if (global.__linoleum) {
  module.exports = global.__linoleum;
} else {
  require('./tasks/clean');
  require('./tasks/lint');
  require('./tasks/cover');

  global.__linoleum = module.exports;
}
