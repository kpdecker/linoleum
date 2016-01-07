import watch, {runTask} from '../src/watch';
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
  it('register tasks with options', function() {
    this.stub(Gulp, 'task');
    watch('*.js', 'foo', {timeout: 1234});
    expect(Gulp.task).to.have.been.calledWith('watch:foo');
  });

  it('should initialize watch', function(done) {
    let counter = 0;
    Gulp.task('doit', function() {
      expect(Index.WATCHING).to.equal(true);

      if (counter++ >= 1) {
        done();
      }
    });
    this.stub(Gulp, 'watch', function(glob, callback) {
      expect(glob).to.equal('*.js');
      callback('foo');
    });
    watch('*.js', 'doit');
    Gulp.start('watch:doit');
  });

  it('should notify change callback', function(done) {
    let counter = 0,
        onChange = this.spy();
    Gulp.task('doit', function() {
      expect(Index.WATCHING).to.equal(true);

      if (counter++ >= 1) {
        expect(onChange)
            .to.have.been.calledOnce
            .to.have.been.calledWith(['foo']);
        done();
      }
    });
    this.stub(Gulp, 'watch', function(glob, callback) {
      expect(glob).to.equal('*.js');
      callback('foo');
    });
    watch('*.js', 'doit', {onChange});
    Gulp.start('watch:doit');
  });

  it('should call setup task', function(done) {
    let counter = 0;
    Gulp.task('setup', function() {
      expect(counter).to.equal(0);
      counter++;
    });
    Gulp.task('doit', function() {
      expect(Index.WATCHING).to.equal(true);

      if (counter++ >= 2) {
        done();
      }
    });
    this.stub(Gulp, 'watch', function(glob, callback) {
      expect(glob).to.equal('*.js');
      callback('foo');
    });
    watch('*.js', 'doit', {setup: 'setup'});
    Gulp.start('watch:doit');
  });

  it('should rerun if triggered while running', function(done) {
    let counter = 0,
        callback;
    Gulp.task('doit', function() {
      expect(Index.WATCHING).to.equal(true);

      if (counter++ >= 2) {
        done();
      } else {
        callback('bar');
      }
    });
    this.stub(Gulp, 'watch', function(glob, _callback) {
      callback = _callback;
      expect(glob).to.equal('*.js');
      callback('foo');
    });
    watch('*.js', 'doit');
    Gulp.start('watch:doit');
  });

  describe('#runTask', function() {
    it('should initialize watch', function(done) {
      let a, b;

      Gulp.task('a', function() {
        a = true;
      });
      Gulp.task('b', function() {
        b = true;
      });
      runTask(['a', 'b'], function() {
        expect(a).to.be.true;
        expect(b).to.be.true;
        done();
      });
    });
    it('should wait until target completes', function(done) {
      let a, b;

      Gulp.task('a', function() {
        a = true;
      });
      Gulp.task('b', ['a'], function() {
        b = true;
      });
      runTask('b', function() {
        expect(a).to.be.true;
        expect(b).to.be.true;
        done();
      });
    });
    it('not fail without callback', function(done) {
      let a;
      Gulp.task('a', function() {
        a = true;
      });
      runTask('a');
      setTimeout(function() {
        expect(a).to.be.true;
        done();
      }, 10);
    });
  });
});
