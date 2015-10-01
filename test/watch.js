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
    let counter = 0;
    Gulp.task('doit', function() {
      expect(Index.WATCHING).to.equal(true);

      console.log('doit', counter);
      if (counter++ >= 1) {
        done();
      }
    });
    this.stub(Gulp, 'watch', function(glob, callback) {
      console.log('watch');
      expect(glob).to.equal('*.js');
      callback();
    });
    watch('*.js', 'doit');
    Gulp.start('watch:doit');
  });
});
