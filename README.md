# Linoleum

Project Recall JavaScript build tools.

That's right I've got a floor.

## Usage

Within `Gulpfile.js`:

```
// Init global state
var Linoleum = require('linoleum');

// Include optional linoleum tasks
require('linoleum/tasks/clean');
require('linoleum/tasks/lint');
require('linoleum/tasks/babel');
require('linoleum/tasks/webpack');
require('linoleum/tasks/test');
require('linoleum/tasks/karma');
require('linoleum/tasks/cover');
```

Global APIs:

- `WATCHING`: Set to true if the build is in watch mode.
- `SOURCE_FILES`: Glob representing source files. May be overridden.
- `TEST_FILES`: Glob representing test files. May be overridden.
- `KARMA_TEST_FILES`: Glob representing karma test files. May be overridden. Will be ignored from mocha tests.
- `BUILD_TARGET`: Path that build artifacts will be output to. May be overridden.
- `COVERAGE_TARGET`: Path that coverage reports will be output to. May be overridden.
- `jsFiles`: Helper used to generate the final list js files glob
- `testFiles`: Helper used to generate the final list test files glob
- `watch`: Helper utility to watch and immediately run a particular command on a set of files:

  ```
  Linoleum.watch(Linoleum.SOURCE_FILES, 'cover');
  ```

  Will create `watch:cover` task.

### linoleum/tasks/clean

Defines the `clean` task which will remove all build and coverage output from the project.

### linoleum/tasks/lint

Defines the `lint` task which will lint all source and test files.

### linoleum/tasks/babel

Defines the `babel` task which builds all source content to their ES5 equivalent.

### linoleum/tasks/webpack

Defines the `webpack` task which generates a client build package.

### linoleum/tasks/test

Defines the `test:mocha` task which runs in-process Node tests.

### linoleum/tasks/karma

Defines the `watch:karma` task which runs Karma tests in watch mode.

### linoleum/tasks/cover

Defines:
- `cover:mocha` task which runs in-process Node coverage tests.
- `cover:karma` task which runs karma coverage tests.
- `cover:report` task which combines raw data from the other coverage tasks and asserts coverage.


## Common issues
### Karma

Travis needs to be configured to use Firefox when running Karma tests. This can be done with the following config:

```
env:
  - KARMA_BROWSER=Firefox

before_script:
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
  - sleep 3 # give xvfb some time to start
```

If a `Error: Path doesn't exist '/_karma_webpack_/karma-index.js'` or similar is seen when running Karma, this is due to the Karma tests directory not existing.
