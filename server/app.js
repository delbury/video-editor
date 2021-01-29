const Koa = require('koa');
const koaStatic = require('koa-static');
const { router } = require('./router');
const koaSession = require('koa-session');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();
app.keys = ['video-editor'];

const SESSION_CONFIG = {
  key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 1000 * 60, // 86400000
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

const staticDir = '../resource';

app
  .use(koaSession(SESSION_CONFIG, app))
  .use(async (ctx, next) => {
    if(!ctx.session.username) {
      ctx.session.username = uuidv4();
    }

    await next();
  })
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    await next();
  })
  .use(koaStatic(staticDir), {
    setHeaders(res) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started Successfully !'));
