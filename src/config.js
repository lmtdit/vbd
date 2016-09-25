

const exports = module.exports = (vdb) => {
  return [
    ['**', {
      domain: vdb.get('domain').dev
    }],
    ['!{libs,apps,widgets,pages,views}/**', {
      release: false
    }],
    ['libs/**', {
      release: '/l/$1',
      isMod: false
    }],
    ['libs/css/**', {
      release: '/l/c/$1'
    }],
    ['libs/img/**', {
      release: '/l/i/$1'
    }],
    ['libs/js/**', {
      release: '/l/j/$1'
    }],
    ['pages/**', {
      release: 'tpl/$1',
      isMod: false
    }]
  ];
};

// 测试的配置
exports.test = [

];

// 生产的配置
exports.prod = [

];
