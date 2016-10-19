import path from 'path';
import fs from 'fs';
import send from 'koa-send';

module.exports = (opts) => {
  return function* combo(next) {
    let fileName;
    const urlPath = this.path;
    if (urlPath === '/') {
      fileName = '/index.html';
    } else if (urlPath.indexOf('.') === -1) {
      fileName = urlPath.indexOf('/data/') !== -1 ? `${urlPath}.json` : `${urlPath}.html`;
    } else {
      fileName = urlPath;
    }
    const fileFullPath = path.join(opts.root, fileName);
    if (isFile(fileFullPath)) {
      const fileExtName = path.extname(fileFullPath);
      this.status = 200;
      console.log('GET', fileName, '200');
      if (fileExtName === '.html') {
        this.body = fs.readFileSync(fileFullPath, {
          encoding: 'utf8'
        });
      } else {
        yield send(this, fileName, opts);
      }
    }
    yield next;
  };
};

function isFile(file) {
  try {
    return fs.existsSync(file) && fs.lstatSync(file).isFile();
  } catch (e) {
    return false;
  }
}
