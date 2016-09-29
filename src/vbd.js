import path from 'path';
import vbd from 'fis3';
import mkdirp from 'mkdirp';
import babel from './parser/babel';

// 安装本地自定义插件;
vbd.set('parser-babel', babel());
vbd.set('parser-babel-node', babel(babel.NODE));
vbd.set('parser-babel-es2015', babel(babel.ESNEXT));
vbd.set('optimizer-clean-css', require('./optimizer/clean-css'));

// 默认以commonjs来组织前端代码结构
vbd.hook('commonjs');

// 开发配置
const cdnDomain = 'st.qimishu.com';
vbd.set('project.ignore', [
  'node_modules/**',
  'dist/**',
  '*.log',
  '**.sh',
  '**.bat'
]).set('domain', {
  dev: `//dev.${cdnDomain}`,
  test: `//test.${cdnDomain}`,
  prod: `//${cdnDomain}`
}).set('comboPattern', '/co/??%s');

const config = [
  ['**', {
    domain: vbd.get('domain').dev
  }],
  [/libs\/css\/(.+)/, {
    release: '/l/c/$1',
    isMod: false
  }],
  [/libs\/img\/(.+)/, {
    release: '/l/i/$1',
    isMod: false
  }],
  [/libs\/js\/(.+)/, {
    release: '/l/j/$1',
    isMod: false
  }],
  [/pages\/(.+)/, {
    release: '/p/$1',
    isMod: false
  }],
  [/widgets\/(.+)/, {
    release: '/w/$1',
    isMod: false
  }]
];

// 开发配置
config.forEach((val) => {
  vbd.match(...val);
});


module.exports = vbd;
