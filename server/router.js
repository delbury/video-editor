const Router = require('@koa/router');

const router = new Router();

router.post('/createVideo', async ctx => {
  ctx.body = {
    msg: 'ok',
  };
});

module.exports = {
  router,
}