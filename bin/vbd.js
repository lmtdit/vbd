#!/usr/bin/env node

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const meta = require('../package.json');

new Liftoff({
  name: meta.name,
  configName: 'vbd-cfg',
  extentsions: {
    '.js': null
  }
}).launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, (env) => {
  const vbd = require(env.modulePath || '..'); // eslint-disable-line
  return vbd.cli.run(argv, env);
});
