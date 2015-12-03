import {instrumenterConfig} from '../src/cover';

import Istanbul from 'istanbul';

import {expect} from 'chai';

describe('coverage helpers', function() {
  describe('instrumenter config', function() {
    it('should provide defaults', function() {
      let config = instrumenterConfig();

      expect(config.embedSource).to.be.true;
      expect(config.includeUntested).to.be.true;
      expect(config.sourceMap).to.be.true;
    });

    it('should provide custom instrumenter', function() {
      let spy = this.spy();
      this.stub(Istanbul, 'Instrumenter', function() {
        return {
          worked: true,
          instrumentSync: spy
        };
      });
      let config = instrumenterConfig();

      expect(config.instrumenter).to.exist;

      let instrumenter = config.instrumenter({});
      expect(instrumenter.worked).to.be.true;
      instrumenter.instrumentSync();
      expect(spy).to.have.been.calledOnce;
    });
  });
});
