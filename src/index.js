import path from 'path';
import vbd from './vbd';
import config from './config';

module.exports = vbd;

const root = path.dirname(__dirname);

// 模块加载路径
vbd.require.paths.unshift(path.join(root, 'node_modules'),
  path.join(root, 'node_modules/fis3/node_modules'));

vbd.set('modules.commands', ['release', 'server', 'init', 'inspect']);

// 安装本地自定义插件

vbd.define('parser-babel', require('./parser/babel'));
vbd.define('parser-minify-html', require('./parser/minify'));
vbd.define('optimizer-clean-css', require('./optimizer/clean-css'));
vbd.define('postpackager-loader-config', require('./postpackager/loader-config'));

// 默认以commonjs来组织前端代码结构
vbd.hook('commonjs');

// 开发配置
const cdnDomain = 'st.qimishu.com';

vbd.set('project.ignore', [
  'node_modules/**',
  'dist/**',
  'output/**',
  '.idea/**',
  '.tmp/**',
  '*.log',
  '*.sh',
  '*.bat',
  '.DS_Store'
]).set('domain', {
  dev: '',
  test: `//test.${cdnDomain}`,
  prod: `//${cdnDomain}`
}).set('comboPattern', '/co/??%s');

// 生成项目配置
const conf = config(vbd);
const testMedia = vbd.media('test');
const prodMedia = vbd.media('prod');
conf.dev.forEach((val) => {
  vbd.match(...val);
});

conf.test.forEach((val) => {
  testMedia.match(...val);
});
conf.prod.forEach((val) => {
  prodMedia.match(...val);
});
