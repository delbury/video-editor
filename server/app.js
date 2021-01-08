const Koa = require('koa');
const { router } = require('./router');

const app = new Koa();

app
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    await next();
  })
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3000, () => console.log('Server Started Successfully !'));
