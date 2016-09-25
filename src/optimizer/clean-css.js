const CleanCSS = require('clean-css');

module.exports = (content, file, conf) => {
  conf.processImport = false;
  return new CleanCSS(conf).minify(content).styles;
};
