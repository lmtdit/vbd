import fs from 'fs';
import os from 'os';
import path from 'path';
import koa from 'koa';
import favicon from 'koa-favicon';
import koaBody from 'koa-body';
import session from 'koa-session';
import koaStatic from 'koa-static';
import combo from './server/combo';

const app = koa();
const osType = os.type();
const serv = module.exports = (vbd) => {
  const reg = /\/\w+\/\w+\//;
  const userPath = osType === 'Darwin' ?
    reg.exec(__dirname)[0] : 'C:/Users/Administrator/AppData/Local';
  const tempRoot = path.join(userPath, '/.vbd-tmp');
  return (argv, env, ...opts) => {
    const projectName = path.basename(env.cwd);
    const serverRoot = path.join(tempRoot, projectName, 'www');
    const port = argv.port || '5000';
    const comboSetting = {
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
      .use(koaStatic(serverRoot))
      .use(combo(comboSetting))
      .listen(port, () => {
        vbd.log.info('Static path: %s', serverRoot);
        vbd.log.info('WebServer run at port %s', port);
      });
  };
};
