import fs from 'fs';
import path from 'path';
import fis from 'fis3';

const vbdInfo = require('../package.json');
const vbd = module.exports = Object.create(fis);

// 定义全局的 vdb 对象
Object.defineProperty(global, vbdInfo.name, {
  enumerable: true,
  value: vbdInfo.name
});

// 封装一个递归创建文件夹的函数，因为fis3.mkdir不支持递归创建
const mkdirsSync = vbd.mkdirsSync = (dir, mode) => {
  if (fs.existsSync(dir)) return true;
  if (mkdirsSync(path.dirname(dir), mode)) {
    fs.mkdirSync(dir, mode);
    return true;
  }
  return false;
};

// 修正fis3不支持多项目的问题
let isProjectRenamed = false;
const getTempRootFn = vbd.project.getTempRoot;
vbd.project.getTempRoot = () => {
  if (!isProjectRenamed) {
    const appInfo = require('../package.json');
    const tempRootPath = path.join(getTempRootFn(), appInfo.name || '');
    vbd.mkdirsSync(tempRootPath);
    vbd.project.setTempRoot(tempRootPath);
    vbd.project.getTempRoot = getTempRootFn;
    isProjectRenamed = true;
  }
  return getTempRootFn();
};

// 本地插件定义入口
const typeOf = obj => Object.prototype.toString.call(obj).slice(8, -1);
const defineFn = vbd.define = (...args) => {
  const arg = args.pop();
  const type = typeOf(arg);
  if (type !== 'Function' && type !== 'object') {
    throw new TypeError(`Invalid type of plugins : ${type}`);
  }
  const name = args.length ? args : arg.name;
  if (!name) {
    throw new TypeError('Invalid type resolve of plugins name');
  }
  vbd.require._cache[name] = arg;
  return arg;
};

// 把当前项目名作为第三方插件的前缀
vbd.require.prefixes.unshift(vbdInfo.name);
const cliRunFn = vbd.cli.run;
Object.assign(vbd.cli, {
  name: vbdInfo.name, // 修改项目名称
  version: () => {
    vbd.log.info(vbdInfo.version);
  },
  run: (argv, env, ...opts) => {
    const cmdList = argv._;
    const command = cmdList[0];
    // 从新定义server 和 init
    switch (command) {
      case 'server': {
        if (!argv.port) argv.port = '5000';
        return require('./commands/server')(vbd)(argv, env, ...opts);
        break;
      }
      case 'init': {
        vbd.log.info('Initialize Project ...\n');
        return require('./commands/init')(vbd)(argv, env, ...opts);
        break;
      }
      default: {
        // 插件的加载优先从当前项目的 node_modules 目录查找
        const paths = vbd.require.paths;
        const dir = path.join(env.cwd, 'node_modules');
        if (paths.indexOf(dir) === -1) vbd.require.paths.unshift(dir);
        return cliRunFn(argv, env, ...opts);
      }
    }
  }
});
