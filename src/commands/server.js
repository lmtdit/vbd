import os from 'os';
import path from 'path';
import koa from 'koa';
import favicon from 'koa-favicon';
import koaBody from 'koa-body';
import session from 'koa-session';
import koaCombo from 'koa-static-combo';
import koaStatic from 'koa-static';
import logger from 'koa-log4js';

const app = koa();
const osType = os.type();
module.exports = (vbd) => {
  const reg = /\/\w+\/\w+\//;
  const userPath = osType === 'Darwin' ?
    reg.exec(__dirname)[0] : 'C:/Users/Administrator/AppData/Local';
  const tempRoot = path.join(userPath, '/.vbd-tmp');
  const print = vbd.log.info;
  return (argv, env, ...opts) => {
    const projectInfo = require(path.join(env.cwd, 'package.json')); // eslint-disable-line
    const projectName = projectInfo.name;
    const serverRoot = path.join(tempRoot, projectName, 'www');
    const comboSetting = {
      port: argv.port || '5000',
      assetsPath: serverRoot,
      routerReg: /^(\/co)(;.+)?(\?\?)(.+)/i,
      comboTag: '??',
      comboDirTag: ';',
      comboModSplit: ',',
      maxAge: 60 * 60 * 24 * 365 * 1000
    };
    app.keys = ['very build for qimishu'];
    app.use(favicon(`${serverRoot}/favicon.ico`))
      .use(koaBody())
      .use(session(app))
      .use(koaCombo(comboSetting))
      .use(koaStatic(serverRoot, {
        maxage: 0,
        defer: true
      }))
      .use(logger())
      .listen(comboSetting.port, () => {
        print('Static path: %s', serverRoot);
        print('WebServer run at port %s', comboSetting.port);
      });
  };
};
