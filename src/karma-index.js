import './sandbox';

// require all modules ending in "_test" from the
// current directory and all subdirectories
let testsContext = require.context('project/test/karma/', true);
testsContext.keys().forEach(testsContext);
