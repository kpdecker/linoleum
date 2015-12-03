import BABEL_DEFAULTS from '../babel-defaults';

import {Instrumenter} from 'istanbul';
import {transform} from 'babel-core';

export function instrumenterConfig() {
  return {
    instrumenter(opts) {
      // Hack around our own instrumenter so we can execute against inline paths but still instrument
      // the transpiled code. This is necessary as ignore statements don't work in isparta right now
      // and development has stalled by a potential istanbul merge. Fun.
      let ret = new Instrumenter(opts);
      let $instrumentSync = ret.instrumentSync;
      ret.instrumentSync = function(code, filename) {
        code = transform(code, Object.assign({filename}, BABEL_DEFAULTS));
        return $instrumentSync.call(this, code.code, filename);
      };
      return ret;
    },
    embedSource: true,
    includeUntested: true,
    sourceMap: true
  };
}
