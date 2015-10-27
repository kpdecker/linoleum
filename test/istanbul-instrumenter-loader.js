import loader from '../src/istanbul-instrumenter-loader';

import {expect} from 'chai';

describe('istanbul-instrumenter-loader', function() {
  it('should run with source map', function(done) {
    let context = {
      resourcePath: 'myfile.js',
      callback(err, source, sourceMap) {
        expect(err).to.not.exist;
        expect(source).to.match(/code;/);
        console.log(sourceMap);
        sourceMap = JSON.parse(sourceMap);
        expect(sourceMap.sources).to.eql(['myfile.js']);
        expect(sourceMap.mappings).to.eql(';;;;;;;;sCASAA,IAAA');
        done();
      }
    };
    loader.call(context, '\n\n\n\n\n\n\n\n\ncode;', {
      version: 3,
      sources: ['1445961972600.js'],
      names: ['code'],
      mappings: ';;;;;;;;sCAAeA,IAAA'
    });
  });
  it('should run without source map', function(done) {
    let context = {
      callback(err, source, sourceMap) {
        expect(err).to.not.exist;
        expect(source).to.match(/code;/);
        expect(sourceMap).to.exist;
        done();
      }
    };
    loader.call(context, 'code;');
  });
  it('should mark as cacheable', function(done) {
    let cacheable = false;
    let context = {
      cacheable() {
        cacheable = true;
      },
      callback() {
        expect(cacheable).to.be.true;
        done();
      }
    };
    loader.call(context, 'code;');
  });
});
