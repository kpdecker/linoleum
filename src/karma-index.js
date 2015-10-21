/* istanbul ignore next */
import './sandbox';

// require all modules ending in "_test" from the
// current directory and all subdirectories
/* istanbul ignore next */
let testsContext = require.context('project/test/karma/', true);
/* istanbul ignore next */
testsContext.keys().forEach(testsContext);
