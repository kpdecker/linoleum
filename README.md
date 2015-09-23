# Linoleum

Project Recall JavaScript build tools.

That's right I've got a floor.

## Usage

Within `Gulpfile.js`:

```
// Init global state
require('linoleum');

// Include optional linoleum tasks
require('linoleum/tasks/clean');
require('linoleum/tasks/lint');
require('linoleum/tasks/babel');
require('linoleum/tasks/test');
```

### linoleum/tasks/clean

Defines the `clean` task which will remove all build and coverage output from the project.

### linoleum/tasks/lint

Defines the `lint` task which will lint all source and test files.

### linoleum/tasks/babel

Defines the `babel` task which builds all source content to their ES5 equivalent.

### linoleum/tasks/test

Defines the `test:mocha` task which runs in-process Node tests.
