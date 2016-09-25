module.exports = {
  write: true,
  prefix: '~',
  devprefix: '^',
  exclude: [
    'lib',
    'test/fixtures'
  ],
  dep: [
    'fis3-hook-commonjs',
    'babel-register',
    'babel-core',
    'fis-parser-babel-6.x'
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
