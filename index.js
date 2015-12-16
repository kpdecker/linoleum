module.exports = require('./config');

// Hack around dependency tree issues when trying to self-test with linoleum-node.
if (global.__linoleum) {
  module.exports = global.__linoleum;
} else {
  require('./tasks/clean');
  require('./tasks/lint');
  require('./tasks/cover');

  global.__linoleum = module.exports;
}
