// Using es5 in this module as it won't be transpiled in child projects
// due to the node_modules babel loader exclude.
/* istanbul ignore next */
require('./sandbox');

// require all modules ending in "_test" from the
// current directory and all subdirectories
/* istanbul ignore next */
let testsContext = require.context('project/test/karma/', true);
/* istanbul ignore next */
testsContext.keys().forEach(testsContext);
