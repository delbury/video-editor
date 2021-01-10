const fs = require('fs').promises;
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const path = require('path');

const ffmpeg = createFFmpeg({ log: true });

const loadVideo = async() => {
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('../resource/test.mp4'));
  await ffmpeg.run('-i', 'test.mp4');
};

loadVideo();