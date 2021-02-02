const path = require('path');
const Router = require('@koa/router');
const { VideoEditor } = require('./VideoEditorExec');
const fs = require('fs').promises;

const staticDirPath = path.resolve(__dirname, '../resource');

const testFileUrl = path.resolve(staticDirPath, './test.mp4');
const outputName = '/ticks.jpg';
const outputDir = path.resolve(staticDirPath, './ticks.jpg');
const outputCutFile = path.resolve(staticDirPath, './cut.mp4');
const tempWatermaskFile = path.resolve(staticDirPath, './watermask.png');

const videoEditor = new VideoEditor();
const router = new Router();

router
  // 生成新视频
  .post('/api/create', async ctx => {
    ctx.body = {
      msg: 'ok',
      videoUrl: '',
    };
  })
  // 视频水印
  .post('/api/watermask', async ctx => {
    try {
      const { data, width, height } = ctx.request.body;
      const png = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      await fs.writeFile(tempWatermaskFile, png);

      await videoEditor.addWatermask(
        testFileUrl,
        tempWatermaskFile, 
        path.resolve(staticDirPath, './watermask.mp4'),
        { width, height },
      );

      ctx.body = {
        msg: 'ok',
        videoUrl: '',
      };
    } catch {
      ctx.status = 500;
    }
    
  })
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