import path from 'path';
import fs from 'fs';
import send from 'koa-send';

module.exports = (opts) => {
  return function* combo(next) {
    const fileName = (this.path === '/') ? '/index.html' : this.path;
    const fileFullPath = path.join(opts.root, fileName);
    if (isFile(fileFullPath)) {
      const fileExtName = path.extname(fileFullPath);
      this.status = 200;
      if (fileExtName === '.html') {
        this.body = fs.readFileSync(fileFullPath, {
          encoding: 'utf8'
        });
      } else {
        yield send(this, this.path, opts);
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
