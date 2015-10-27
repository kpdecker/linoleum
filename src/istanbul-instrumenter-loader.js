import {Instrumenter} from 'istanbul';
import convertSourceMap from 'convert-source-map';

// Customized from istanbul-instrument-loader to support
// source maps properly.
module.exports = function(source, sourceMap) {
  if (sourceMap) {
    source = `${source}\n${convertSourceMap.fromObject(sourceMap).toComment()}`;
  }

  let instrumenter = new Instrumenter({
    embedSource: true,
    includeUntested: true,
    sourceMap: true
  });

  if (this.cacheable) {
    this.cacheable();
  }

  source = instrumenter.instrumentSync(source, this.resourcePath);
  sourceMap = convertSourceMap.fromSource(source).toJSON();

  this.callback(undefined, source, sourceMap);
};
