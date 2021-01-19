const fs = require('fs').promises;
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const path = require('path');

class VideoEditor {
  static videoDurationReg = /Duration:\s(\d{2}):(\d{2}):(\d{2}\.\d{2}),/i;
  static videoFpsReg = /Stream.*Video.*,\s(\d+)\sfps,/i;
  constructor() {
    this.resetVideoInfo();
    this.ffmpeg = createFFmpeg({
      log: true,
      logger: (msg) => {
        // 获取视频时长
        if(!this.videoInfo.duration && VideoEditor.videoDurationReg.test(msg.message)) {
          const res = msg.message.match(VideoEditor.videoDurationReg);
          this.videoInfo.duration = (+res[1] * 3600) + (+res[2] * 60) + (+res[3]);
        }

        // 获取视频fps
        if(!this.videoInfo.fps && VideoEditor.videoFpsReg.test(msg.message)) {
          const res = msg.message.match(VideoEditor.videoFpsReg);
          this.videoInfo.fps = +res[1];
        }
      }
    });
    this.ffmpeg.load();
  }

  // 初始化视频信息
  resetVideoInfo() {
    this.videoInfo = {
      duration: null,
      fps: null,
    };
  }

  async loadVideo(inputUrl, outputUrl) {
    if(!inputUrl) throw new Error('must has an input url !');
    if(!this.ffmpeg.isLoaded()) return;

    const inputName = 'test.mp4';
    const outputName = 'strip.jpg';

    try {
      this.ffmpeg.FS('writeFile', inputName, await fetchFile(inputUrl));
  
      this.resetVideoInfo();
      await this.ffmpeg.run('-i', inputName, '-hide_banner');
  
      const step = Math.floor(this.videoInfo.duration * this.videoInfo.fps / 9);
      await this.ffmpeg.run(
        '-y',
        '-ss', '0.0', '-i', inputName,
        '-vf', `select='not(mod(n\\,${step}))',scale=128:-1,tile=10x1`,
        '-frames:v', '1', '-q:v', '5', '-an',
        outputName,
        '-hide_banner'
      );

      const img = this.ffmpeg.FS('readFile', outputName);
      fs.writeFile(outputUrl ?? outputName, img);
    } catch (err) {

    }
    
  };
}

module.exports = {
  VideoEditor,
};