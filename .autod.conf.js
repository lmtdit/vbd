module.exports = {
  write: true,
  prefix: '~',
  devprefix: '^',
  exclude: [
    'test'
  ],
  dep: [
    'fis3-hook-commonjs',
    'fis3-preprocessor-js-require-css',
    'fis3-preprocessor-js-require-file',
    'babel-register',
    'babel-core'
  ],
  devdep: [
    'autod',
    'babel-eslint',
    'babel-plugin-transform-async-to-generator',
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-transform-es2015-arrow-functions',
    'babel-plugin-transform-es2015-for-of',
    'babel-plugin-transform-es2015-modules-commonjs',
    'babel-plugin-transform-es2015-parameters',
    'babel-plugin-transform-es2015-spread',
    'babel-preset-es2015',
    'babel-preset-stage-1',
    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'mocha',
    'should',
    'thunk-mocha'
  ],
  keep: [
  ],
  semver: [
  ]
};
