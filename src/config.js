module.exports = (vdb) => {
  // 开发配置
  const dev = [
    ['**', {
      domain: vdb.get('domain').dev
    }],
    ['!{libs,apps,widgets,pages,views}/**', {
      release: false
    }],
    ['**.css', {
      useSprite: true
    }],
    ['{**.md,vbd-conf.js,package.json}', {
      release: false
    }],
    ['**.{html,tpl}', {
      isHtmlLike: true,
      release: false,
      parser: vbd.plugin('minify-html')
    }],
    ['libs/(**)', {
      release: '/l/$1',
      isMod: false
    }],
    ['libs/css/(**)', {
      release: '/l/c/$1'
    }],
    ['libs/img/(**)', {
      release: '/l/i/$1'
    }],
    ['libs/js/(**)', {
      release: '/l/j/$1'
    }],
    ['pages/(**)', {
      release: 'p/$1',
      isMod: false
    }],
    ['widgets/(**)', {
      release: 'w/$1',
      isMod: false
    }],
    ['apps/(**)', {
      release: 'w/$1',
      isMod: false
    }],
    [/widgets\/(.*?([^\/]+))\/\2(\.js)/, {
      id: 'w/$1',
      moduleId: 'w/$1',
      release: '/w/$1/$2$3',
      url: '/w/$1/$2$3',
      isMod: true,
      isComponent: true,
      useSameNameRequire: true
    }],
    [/apps\/(.*?([^\/]+))\/\2(\.js)/, {
      id: 'a/$1',
      moduleId: 'a/$1',
      release: '/a/$1/$2$3',
      url: '/a/$1/$2$3',
      isMod: true,
      isComponent: true,
      useSameNameRequire: true
    }],
    [/(.*)?(_[^\/]+)(.*)/i, {
      release: false
    }],
    ['::packager', {
      postpackager: vbd.plugin('loader-config'),
      spriter: vbd.plugin('csssprites', {
        margin: 10,
        layout: 'matrix'
      })
    }]
  ];
  // 输出配置
  const output = [
    ['**.css', {
      optimizer: vbd.plugin('clean-css', {}, 'append'),
      useHash: true
    }],
    ['**.js', {
      optimizer: vbd.plugin('uglify-js', {}, 'append'),
      useHash: true
    }],
    ['**.png', {
      optimizer: vbd.plugin('png-compressor', {}, 'append'),
      useHash: true
    }]
  ];
  // 测试配置
  const test = [
    ['**', {
      domain: vbd.get('domain').test
    }],
    ...output
  ];
  // 生产配置
  const prod = [
    ['**', {
      domain: vbd.get('domain').prod
    }],
    ...output
  ];
  return {
    dev,
    test,
    prod
  };
};
