/* eslint-disable object-shorthand */
module.exports = {
  // We need to make sure that the transpiler hit the linoleum source since we are
  // not building to npm or simliar.
  ignore: function(filename) {
    return ((/node_modules/.test(filename))
        && !(/linoleum(-[^/]*)?\/electron/.test(filename))
        && !(/linoleum(-[^/]*)?\/src/.test(filename))
        && !(/linoleum(-[^/]*)?\/tasks/.test(filename)))
        || (/\$.*\$/.test(filename));
  },
  sourceMap: 'inline',
  auxiliaryCommentBefore: 'istanbul ignore start',
  auxiliaryCommentAfter: 'istanbul ignore end',
  presets: [
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0')
  ]
};
