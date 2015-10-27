import plumber from '../src/plumber';
import * as Index from '../index';

import GUtil from 'gulp-util';
import through from 'through2';

import {expect} from 'chai';
import Sinon from 'sinon';

describe('plumber', function() {
  beforeEach(function() {
    Index.WATCHING = true;
  });
  afterEach(function() {
    Index.WATCHING = false;
  });

  it('should handle errors while watching', function() {
    this.stub(GUtil, 'log');

    plumber()
      .pipe(through(function() {}))
      .emit('error', 'error!');

    expect(GUtil.log)
        .to.have.been.called
        .to.have.been.calledWith(Sinon.match(/unhandled error/), Sinon.match(/error!/));
  });
  it('should handle mocha init errors while watching', function(done) {
    this.stub(GUtil, 'log');

    plumber(function() {
        expect(GUtil.log)
            .to.have.been.called
            .to.have.been.calledWith(Sinon.match(/unhandled error/), Sinon.match(/error!/));

        done();
      })
      .pipe(through(function() {}))
      .emit('error', {
        toString() {
          return 'error!';
        },
        plugin: 'gulp-mocha',
        showStack: true
      });
  });
});
