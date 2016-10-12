import { transform } from 'babel-core';

module.exports = function babelParser(content, file, conf) {
  return transform(content, {
    presets: ['es2015', 'stage-1'],
    plugins: [
      'transform-async-to-generator',
      'transform-decorators-legacy',
      'transform-es2015-arrow-functions',
      'transform-es2015-for-of',
      'transform-es2015-modules-commonjs',
      'transform-es2015-parameters',
      'transform-es2015-spread'
    ]
  }).code;
};
