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
require('linoleum/tasks/test');
require('linoleum/tasks/cover');
```

Global APIs:

- `WATCHING`: Set to true if the build is in watch mode.
- `SOURCE_FILES`: Glob representing source files. May be overridden.
- `TEST_FILES`: Glob representing test files. May be overridden.
- `BUILD_TARGET`: Path that build artifacts will be output to. May be overridden.
- `COVERAGE_TARGET`: Path that coverage reports will be output to. May be overridden.
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

### linoleum/tasks/test

Defines the `test:mocha` task which runs in-process Node tests.

### linoleum/tasks/cover

Defines the `cover:mocha` task which runs in-process Node coverage tests.
