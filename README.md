# Linoleum

Shared javascript build and testing infrastructure

Base project to avoid duplicating infrastructure boilerplate across javascript projects. Provides linting, es6, code coverage, with source maps all running in node, browser, or electron environments.

- For Node, see [linoleum-node](https://github.com/kpdecker/linoleum-node).
- For Webpack browser builds, see [linoleum-webpack](https://github.com/kpdecker/linoleum-webpack).
- For Electron, see [linoleum-electron](https://github.com/kpdecker/linoleum-electron).

That's right I've got a floor.

## Usage

Within `Gulpfile.js`:

```
// Init global state
var Linoleum = require('linoleum');

// Include optional linoleum tasks
require('linoleum-node');
require('linoleum-webpack');
require('linoleum-electron');
```

Global APIs:

- `WATCHING`: Set to true if the build is in watch mode.
- `SOURCE_FILES`: Glob representing source files. May be overridden.
- `TEST_FILES`: Glob representing test files. May be overridden.
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

### linoleum/tasks/cover

Defines:
- `cover:untested` task which runs empty coverage report to ensure that untested files are included in `cover:report`.
- `cover:report` task which combines raw data from the other coverage tasks and asserts coverage.

## Common issues
### Node Compile Issues

Newer versions of Node (5+, potentially earlier) may run into native compiler errors under Travis due to older versions of the C++ compiler. This can be resolved via this config:

```
addons:
  apt:
    sources:
    - ubuntu-toolchain-r-test
    packages:
    - g++-4.8
env:
  - CXX=g++-4.8
```
