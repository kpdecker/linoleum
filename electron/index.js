import App from 'app';
import BrowserWindow from 'browser-window';
import ipc from 'ipc';

import {Collector, Report} from 'istanbul';
import mkdirp from 'mkdirp';
import Mocha from 'mocha';

let mainWindow = null;

let args = process.argv,
    len = args.length,
    main = args[len - 3],
    renderer = args[len - 2],
    coverageDir = args[len - 1],

    failures = 0;


process.on('uncaughtException', (error) => {
  // This breaks Mocha's handler, but that seems safer than
  // trying to guess which handlers are installed.
  console.log(error.stack);
  process.exit(255);
});

App.on('window-all-closed', function() {
  App.quit();
});
App.on('quit', function() {
  process.exit(failures);
});

App.on('ready', function() {
  mainWindow = new BrowserWindow({show: false, width: 800, height: 600});

  mainWindow.webContents.on('dom-ready', function() {
    // Kick off the main tests
    let mocha = new Mocha({});
    mocha.addFile(main);
    mocha.run(function(mainFailures) {
      failures += mainFailures;

      // Kick off the renderer tests
      mainWindow.webContents.executeJavaScript(`
        try {
          require(${JSON.stringify(renderer)});

          mocha.run(function(failures) {
            ipc.send('done', failures, window.__coverage__);
          });
        } catch (err) {
          console.log(err.stack);
          ipc.send('done', 255);
        }
      `);
    });
  });

  mainWindow.loadUrl(`file://${__dirname}/index.html`);

  ['log', 'error', 'warn', 'debug'].forEach((type) => {
    ipc.on(type, function(event, args) {
      /* eslint-disable no-console */
      (console[type] || console.log)(...args);
    });
  });

  ipc.on('done', function(event, rendererFailures, coverage) {
    failures += rendererFailures;
    writeCoverage(global.__coverage__, coverage);

    mainWindow.close();
  });
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

function writeCoverage(mainCoverage, rendererCoverage) {
  if (!mainCoverage && !rendererCoverage) {
    return;
  }

  let collector = new Collector();
  collector.add(mainCoverage || {});
  collector.add(rendererCoverage || {});

  mkdirp.sync(coverageDir);

  let report = Report.create('json', {dir: coverageDir});
  report.writeReport(collector, true);
}
