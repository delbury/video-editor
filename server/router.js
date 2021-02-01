const path = require('path');
const Router = require('@koa/router');
const { VideoEditor } = require('./VideoEditorExec');
const fs = require('fs').promises;

const testFileUrl = path.resolve(__dirname, '../resource/test.mp4');
const outputName = '/ticks.jpg';
const outputDir = path.resolve(__dirname, '../resource' + outputName);
const outputCutFile = path.resolve(__dirname, '../resource/cut.mp4');

const videoEditor = new VideoEditor();
const router = new Router();

router
  // 视频裁剪
  .post('/api/cutVideo', async ctx => {
    const range = ctx.request.body.range ?? [];

    try {
      const url = await videoEditor.cutVideoByFFmpeg(testFileUrl, range, outputCutFile);

      ctx.body = {
        msg: 'ok',
        processedfileUrl: 'url',
      };
    } catch {
      ctx.status = 500;
    }
  })
  // 获取帧拼图
  .get('/api/tickImages', async ctx => {
    try {
      try {
        await fs.access(outputDir)
      } catch {
        await videoEditor.loadVideo(testFileUrl, outputDir);
      }
      ctx.body = {
        msg: 'ok',
        url: outputName,
      };
    } catch {
      ctx.status = 500;
    }
  })
  .get('/api/session', async ctx => {
    console.log(ctx.session.username)

    ctx.body = {
      msg: 'ok',
      session: ctx.session.username,
    };
  });

module.exports = {
  router,
}