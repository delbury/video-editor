const child_process = require('child_process');
const fs = require('fs').promises;
const path = require('path');


class VideoEditor {
  static videoDurationReg = /Duration:\s(\d{2}):(\d{2}):(\d{2}\.\d{2}),/i;
  static videoFpsReg = /Stream.*Video.*,\s(\d+)\sfps,/i;
  constructor() {
    this.videoInfo = {
      duration: null,
      fps: null,
    };
  }

  // 解析视频信息
  resolveVideoInfo(stdout) {
    const videoInfo = {
      duration: null,
      fps: null,
    };

    if(stdout) {
      // 获取视频时长
      if(VideoEditor.videoDurationReg.test(stdout)) {
        const res = stdout.match(VideoEditor.videoDurationReg);
        videoInfo.duration = (+res[1] * 3600) + (+res[2] * 60) + (+res[3]);
      }

      // 获取视频fps
      if(VideoEditor.videoFpsReg.test(stdout)) {
        const res = stdout.match(VideoEditor.videoFpsReg);
        videoInfo.fps = +res[1];
      }

      return videoInfo;
    }
  }

  // ffmpeg 获取视频信息
  getVideoInfoByFFmpeg(fileUrl) {
    return new Promise((resolve, reject) => {
      try {
        child_process.exec(
          `ffprobe -i ${fileUrl} -hide_banner`,
          {},
          (err, stdout, stderr) => {
            resolve(this.resolveVideoInfo(stderr));
          },
        );
      } catch(err) {
        reject(err);
      }
    });
  }

  loadVideo(inputUrl, outputUrl = 'ticks.jpg') {
    if(!inputUrl) throw new Error('must has an input url !');

    return new Promise(async (resolve, reject) => {
      try {
        console.log('start creating ticks...');
        this.videoInfo = await this.getVideoInfoByFFmpeg(inputUrl);
        const step = Math.floor(this.videoInfo.duration * this.videoInfo.fps / 9);
  
        child_process.exec(
          [ 
            'ffmpeg',
            '-y',
            '-ss', '0.0', '-i', inputUrl,
            '-vf', `select='not(mod(n\\,${step}))',scale=128:-1,tile=10x1`,
            '-frames:v', '1', '-q:v', '5', '-an',
            outputUrl,
            '-hide_banner'
          ].join(' '),
          {},
          (err, stdout, stderr) => {
            if(err) {
              console.log('created ticks failed .');
              reject(err);
            } else {
              console.log('created ticks successfully .');
              resolve();
            }
            // console.log(err);
            // console.log(stdout);
            // console.log(stderr);
          }
        );
  
      } catch (err) {
        console.log('created ticks failed .');
        reject(err);
      }
    });
    
  };
}

module.exports = {
  VideoEditor,
};

// const fileUrl = '../resource/test.mp4';
// const ve = new VideoEditor();
// ve.loadVideo(fileUrl);