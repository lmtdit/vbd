/* global vbd */
// const _ = vbd.util;

module.exports = (ret, conf, setting, opt) => {
  const currMedia = vbd.project.currentMedia();
  const VBD_CONFIG_REG = /\b__VBD_CONFIG__\b/g;
  const VBD_CONFIG_JS_REG = /\b__CONFIG_JS__\b/;
  const ids = Object.keys(ret.ids);
  const loaderConfig = getLoaderConfig(currMedia);
  const tplList = [];
  [].forEach.call(ids, (key) => {
    const file = ret.ids[key];
    // compile css to js module
    if (file.isCssLike && file.isMod) {
      const cssId = file.getId();
      const cssContent = JSON.stringify(file.getContent());
      const cssToJsPath = vbd.project.getProjectPath(file.release);
      const cssToJsFile = vbd.file(`${cssToJsPath}.js`);
      cssToJsFile.id = cssId;
      cssToJsFile.moduleId = cssId;
      cssToJsFile.setContent(`define(${JSON.stringify(cssId)}, ${cssContent})`);
      cssToJsFile.isMod = true;
      cssToJsFile.useSprite = true;
      cssToJsFile.isJsLike = true;
      cssToJsFile.useHash = currMedia !== 'dev';
      cssToJsFile.release = `${file.release}.js`;
      ret.pkg[cssId] = cssToJsFile;
      file.release = false;
    }

    // build alias and deps
    if ((file.isJsLike || file.isCssLike) && file.isMod) {
      const id = file.getId();
      const url = file.url;
      const uri = file.isJsLike ? url.replace('.js', '') : url;
      const fileHash = file.isCssLike && ret.pkg[id] ? ret.pkg[id].getHash(id) : file.getHash(id);
      loaderConfig.alias[id] = [uri.replace(/^\//, ''), fileHash];
      if (file.map && file.map.deps && file.map.deps.length) {
        const deps = file.map.deps.slice();
        loaderConfig.deps[id] = deps;
      }
      const jsonStr = JSON.stringify(loaderConfig.alias) + JSON.stringify(loaderConfig.deps);
      loaderConfig.hash = vbd.util.md5(jsonStr);
    }

    // mark tpl
    if (file.isHtmlLike && file.isEntry) tplList.push(key);
  });
  // build loadconfig file
  const configStr = JSON.stringify(loaderConfig, null, currMedia !== 'dev' ? 0 : 2);
  const configFileName = 'vconfig.js';
  const configFile = vbd.file(vbd.project.getProjectPath(configFileName));
  configFile.setContent(`require.config(${configStr})`);
  configFile.id = 'vconfig';
  configFile.moduleId = 'vconfig';
  configFile.release = '/vconfig.js';
  configFile.isMod = false;
  configFile.useHash = currMedia !== 'dev';
  configFile.domain = loaderConfig.domain;
  let configJsUri = configFile.domain + configFile.getHashRelease();
  if (currMedia === 'dev') {
    configJsUri = `${configFile.domain + configFile.release}?hash=${configFile.getHash()}`;
  }
  ret.pkg[configFileName] = configFile;

  // compile tpl
  [].forEach.call(tplList, (key) => {
    const file = ret.ids[key];
    const tplCon = file.getContent()
      .replace(VBD_CONFIG_REG, configStr)
      .replace(VBD_CONFIG_JS_REG, configJsUri);
    const tplFile = vbd.file(vbd.project.getProjectPath(key));
    tplFile.setContent(tplCon);
    tplFile.release = file.release;
    ret.pkg[key] = tplFile;
    file.release = false;
  });
};

function getLoaderConfig(currMedia) {
  const loaderConfig = vbd.get('loader-config') || {};
  loaderConfig.hash = '';
  loaderConfig.debug = currMedia === 'dev';
  loaderConfig.combo = !vbd.get('isNotCombo');
  loaderConfig.cache = !vbd.get('isNotCache');
  loaderConfig.domain = vbd.get('domain')[currMedia] || '';
  loaderConfig.alias = {};
  loaderConfig.deps = {};
  return loaderConfig;
}
