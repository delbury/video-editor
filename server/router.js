const path = require('path');
const Router = require('@koa/router');
const { VideoEditor } = require('./VideoEditorExec');

const router = new Router();

const testFileUrl = path.resolve(__dirname, '../resource/test.mp4');
const outputName = '/ticks.jpg';
const outputDir = path.resolve(__dirname, '../resource' + outputName);
const videoEditor = new VideoEditor();

router.get('/tickImages', async ctx => {
  try {
    await videoEditor.loadVideo(testFileUrl, outputDir);
    ctx.body = {
      msg: 'ok',
      url: outputName,
    };
  } catch {
    ctx.status = 500;
  }
});

module.exports = {
  router,
}