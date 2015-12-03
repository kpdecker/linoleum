// Helper file to work around some minor differences between the needs when testing these projects directly and
// when testing normal projects. Pulled out to remove noise from the normal Gulpfiles and to provide better
// real world examples in those files.
import * as Linoleum from './index';

// Add our tests and local files to the linter
let $jsFiles = Linoleum.jsFiles;
Linoleum.jsFiles = function() {
  return $jsFiles().concat('tasks/*.js', '*.js');
};

// Needed to ensure that we lookup the proper sandbox module when under test
Linoleum.TEST_FILES = [__dirname + '/src/sandbox.js', 'test/**/*.js'];    // eslint-disable-line prefer-template
