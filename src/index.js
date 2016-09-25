import path from 'path';
import fis from 'fis3';
import mkdirp from 'mkdirp';
import babel from './parser/babel';
// import config from './config';


const root = path.dirname(__dirname);
const typeOf = obj => Object.prototype.toString.call(obj).slice(8, -1);
const vbd = module.exports = Object.create(fis);

// 定义全局的 vdb 对象
Object.defineProperty(global, 'vbd', {
  enumerable: true,
  value: vbd
});

let isProjectRenamed = false;
function projectRename() {
  const getTempRootFn = vbd.project.getTempRoot;
  vbd.project.getTempRoot = () => {
    if (!isProjectRenamed) {
      const appPkg = require(vbd.project.getProjectPath('package.json')); //  eslint-disable-line
      const tempRootPath = path.join(getTempRootFn(), appPkg.name || '');
      mkdirp.sync(tempRootPath);
      vbd.project.setTempRoot(tempRootPath);
      vbd.project.getTempRoot = getTempRootFn;
      isProjectRenamed = true;
    }
    return getTempRootFn();
  };
}

// 本地的fis3插件定义入口
vbd.define = (...args) => {
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

projectRename();

vbd.require.paths.unshift(path.join(root, 'node_modules'),
path.join(root, 'node_modules/fis3/node_modules'));
vbd.get('project.ignore').unshift('.idea/**', '.tmp/**', '*.log', '.DS_Store');
vbd.set('modules.commands', ['release', 'server']);

// 安装本地自定义插件
vbd.define('parser-babel', babel());
vbd.define('parser-babel-node', babel(babel.NODE));
vbd.define('parser-babel-es2015', babel(babel.ESNEXT));
vbd.define('optimizer-clean-css', require('./optimizer/clean-css'));

// 默认以commonjs来组织前端代码结构
// vbd.hook('commonjs');

// 开发配置
const cdnDomain = 'st.qimishu.com';

vbd.set('project.ignore', [
  'node_module/**',
  'dist/**',
  '*.log',
  '**.sh',
  '**.bat'
]).set('domain', {
  dev: '',
  test: `//test.${cdnDomain}`,
  prod: `//${cdnDomain}`
}).set('comboPattern', '/co/??%s');
//
// // 开发配置
// config(vbd).forEach((val) => {
//   vbd.match(...val);
// });

// 测试和生产配置
// const testMedia = vbd.media('test');
// const prodMedia = vbd.media('prod');
// config.test.forEach((val) => {
//   testMedia.match(...val);
// });
// config.prod.forEach((val) => {
//   prodMedia.match(...val);
// });
