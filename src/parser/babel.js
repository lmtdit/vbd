import { transform } from 'babel-core';

const exports = module.exports = (opts) => {
  return (content, file, conf) => {
    if (file.useBabel === false) {
      return content;
    }
    return transform(content, { opts, ...conf }).code;
  };
};

exports.NODE = {
  presets: ['stage-1'],
  plugins: [
    'transform-async-to-generator',
    'transform-decorators-legacy',
    'transform-es2015-arrow-functions',
    'transform-es2015-for-of',
    'transform-es2015-modules-commonjs',
    'transform-es2015-parameters',
    'transform-es2015-spread'
  ]
};

exports.ESNEXT = {
  presets: ['es2015', 'stage-1']
};
