import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import lru from 'lru-cache';

module.exports = (o) => {
  const opts = Object.assign({}, o);
  const cache = lru({
    max: 300,
    maxAge: 1000 * 60 * 60 * 24
  });
  return function* combo(next) {
    let sendData = true;
    let fileExt = null;
    const req = this.request;
    const url = req.url;

    if (opts.routerReg.test(url)) {
      const etag = cache && cache.get(url);
      const cons = [];
      const assetsPath = opts.assetsPath;
      const comboTag = opts.comboTag;
      const comboDirTag = opts.comboDirTag;
      const comboModSplit = opts.comboModSplit;
      const addToList = (file) => {
        let con = cache && cache.get(file);
        if (!con) {
          try {
            con = fs.readFileSync(file, {
              encoding: 'utf8'
            });
            if (cache) cache.set(file, con);
          } catch (e) {
            sendData = false;
          }
        }
        cons.push(con);
      };
      const comboArr = url.split(comboTag);
      const filePrefix = comboArr[0].split(comboDirTag);
      const files = comboArr[1].split(comboModSplit);
      filePrefix.shift();
      [].forEach.call(files, (key, index) => {
        if (sendData) {
          const file = path.join(filePrefix[0], key);
          const filePath = getRealPath(assetsPath, file);
          sendData = sendData && !!filePath;
          const ext = path.extname(filePath);
          if (index === 0 && ['.css', '.js'].indexOf(ext) !== -1) fileExt = ext;
          if (fileExt === ext) addToList(filePath);
        }
      });
      if (sendData && cons.length) {
        const conString = cons.join('\n');
        const conMd5 = md5(conString);
        if (conMd5 === etag) {
          this.status = 304;
        } else {
          this.type = fileExt.slice(1);
          this.status = 200;
          this.set({ 'Cache-Control': `publish,max-age=${opts.maxAge}` });
          this.set({ Etag: conMd5 });
          cache.set(url, conMd5);
          this.body = conString;
        }
      } else {
        this.status = 404;
        this.body = 'Not Found';
      }
    }
    yield next;
  };
};


// 获取静态资源的真实地址
// 如果文件路径没有拆过root范围则返回真实地址
// 否则返回false，避免xss攻击
function getRealPath(root, file) {
  const realPath = path.join(root, file);
  return !/(?:^|[\\\/])\.\.(?:[\\\/]|$)/.test(path.relative(root, realPath)) && realPath;
}

function md5(source) {
  let _buf, _str;
  _buf = new Buffer(source);
  _str = _buf.toString('binary');
  return crypto.createHash('md5').update(_str).digest('hex');
}
