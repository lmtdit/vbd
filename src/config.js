module.exports = (vbd) => {
  // 开发配置
  const dev = [
    ['**', {
      domain: vbd.get('domain').dev
    }],
    ['!{libs,apps,components,pages,views}/**', {
      release: false
    }],
    ['**.css', {
      useSprite: true
    }],
    ['{apps,components,views/pages}/**.{js,es}', {
      parser: vbd.plugin('babel')
    }],
    ['{**.md,vbd-conf.js,**.json}', {
      release: false
    }],
    ['**.{html,tpl}', {
      isHtmlLike: true,
      useMap: true,
      parser: vbd.plugin('minify-html')
    }],
    [/\/(.+)?views\/(.+)/, {
      release: '/$1v/$2',
      url: '/$1v/$2'
    }],
    [/\/(.+)?views\/css\/(.+)/, {
      release: '/$1v/c/$2',
      url: '/$1v/c/$2'
    }],
    [/\/(.+)?views\/img\/(.+)/, {
      release: '/$1v/i/$2',
      url: '/$1v/i/$2'
    }],
    [/\/(.+)?views\/libs\/(.+)/, {
      release: '/$1v/l/$2',
      url: '/$1v/l/$2',
      isMod: false,
      parser: null
    }],
    [/\/(.+)?views\/pages\/(.+)(\.:?js|css)/, {
      id: '$1v/p/$2',
      moduleId: '$1v/p/$2',
      release: '/$1v/p/$2',
      url: '/$1v/p/$2',
      isEntry: true,
      isMod: true,
      useBabel: true
    }],
    [/\/pages\/(.+)(\.html)/, {
      id: '$1$2',
      release: '/$1$2',
      url: '/$1$2',
      parser: null,
      isEntry: true,
      isMod: false
    }],
    [/\/(.+)?common\/(.+)/, {
      release: '/$1c/$2',
      url: '/$1c/$2',
      isMod: true
    }],
    [/\/(.+)?common\/(.+)(\.js)/, {
      id: '$1c/$2',
      moduleId: '$1c/$2',
      release: '/$1c/$2$3',
      url: '/$1c/$2$3',
      useSameNameRequire: true
    }],
    [/\/(.+)?common\/(.+)(\.css)/, {
      id: '$1c/$2$3',
      moduleId: '$1c/$2$3',
      release: '/$1c/$2$3',
      url: '/$1c/$2$3'
    }],
    [/\/(.+)?components\/(.+)/, {
      release: '/$1cp/$2',
      url: '/$1cp/$2',
      isMod: true
    }],
    [/\/(.+)?components\/(.*?([^\/]+))\/\2(\.js)/, {
      id: '$1cp/$2',
      moduleId: '$1cp/$2',
      release: '/$1cp/$2/$3$4',
      url: '/$1cp/$2/$3$4',
      isMod: true,
      useSameNameRequire: true,
      useBabel: true
    }],
    [/\/(.+)?components\/(.+)(\.css)/, {
      id: '$1cp/$2$3',
      moduleId: '$1cp/$2$3',
      release: '/$1cp/$2$3',
      url: '/$1cp/$2$3',
      isMod: true,
      useSameNameRequire: true
    }],
    ['**components/**.{html,tpl}', {
      release: false
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
