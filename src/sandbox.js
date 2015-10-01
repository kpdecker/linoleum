/* eslint-env mocha */
import Chai from 'chai';
import ChaiString from 'chai-string';
import Sinon from 'sinon';
import SinonChai from 'sinon-chai';

Chai.use(ChaiString);
Chai.use(SinonChai);

beforeEach(function() {
  this.sandbox = Sinon.sandbox.create({
    injectInto: this,
    properties: ['spy', 'stub', 'mock'],
    useFakeTimers: false,
    useFakeServer: false
  });
});
afterEach(function() {
  this.sandbox.restore();
});

/* istanbul ignore next */
function unhandledRejection(err) {
  throw err;
}
before(function() {
  process.on('unhandledRejection', unhandledRejection);
});
after(function() {
  process.removeListener('unhandledRejection', unhandledRejection);
});
