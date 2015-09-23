import watch from '../src/watch';
import * as Index from '../index';

import Gulp from 'gulp';

import {expect} from 'chai';

describe('watch', function() {
  afterEach(function() {
    Index.WATCHING = false;
  });

  it('register tasks', function() {
    this.stub(Gulp, 'task');
    watch('*.js', 'foo');
    expect(Gulp.task).to.have.been.calledWith('watch:foo');
  });

  it('should initialize watch', function(done) {
    this.stub(Gulp, 'start');
    this.stub(Gulp, 'watch');
    this.stub(Gulp, 'task', function(name, fn) {
      fn();
      expect(Index.WATCHING).to.equal(true);
      expect(Gulp.watch).to.have.been.calledWith('*.js', ['foo']);
      expect(Gulp.start).to.have.been.calledWith('foo');
      done();
    });
    watch('*.js', 'foo');
  });
});
