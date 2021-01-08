const fs = require('fs').promises;
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const path = require('path');

const ffmpeg = createFFmpeg({ log: true });

const loadVideo = async() => {
  await ffmpeg.load();

  const method = ffmpeg.FS('readFile', path.resolve(__dirname, '../resource/test.mp4'));
  console.log(method);
};

loadVideo();