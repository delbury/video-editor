const Koa = require('koa');
const koaStatic = require('koa-static');
const { router } = require('./router');

const app = new Koa();
const staticDir = '../resource';

app
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
