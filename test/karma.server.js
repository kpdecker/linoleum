/* eslint-disable no-process-env */
import karma from '../src/karma';

import {expect} from 'chai';

describe('karma config', function() {
  const KARMA_BROWSER = process.env.KARMA_BROWSER;
  afterEach(function() {
    if (KARMA_BROWSER) {
      process.env.KARMA_BROWSER = KARMA_BROWSER;
    } else {
      delete process.env.KARMA_BROWSER;
    }
  });

  it('should generate config', function() {
    // Success is not throwing at this point. The simple karma tests
    // will do the actual verification
    karma({set() {}});
  });

  it('should default to chrome browser', function() {
    process.env.KARMA_BROWSER = '';

    let config;
    karma({set(_config) { config = _config; }});
    expect(config.browsers).to.eql(['Firefox']);
  });
  it('should allow custom browser', function() {
    process.env.KARMA_BROWSER = 'test!';

    let config;
    karma({set(_config) { config = _config; }});
    expect(config.browsers).to.eql(['test!']);
  });
});
