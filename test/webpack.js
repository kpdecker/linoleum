/* eslint-disable no-process-env */
import webpack from '../src/webpack';

import {expect} from 'chai';

describe('webpack config', function() {
  let env;
  beforeEach(() => {
    env = process.env.NODE_ENV;
  });
  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  it('should generate production config', function() {
    process.env.NODE_ENV = 'production';

    let config = webpack();
    expect(config.plugins).to.have.length(3);
  });
});
