import { WatermarkEditor } from './WatermarkEditor.js';
import { VideoController } from './VideoController.js';

export class VideoEditor {
  constructor(container, width = 800, height = 480) {
    this.reqAF = null;
    this.initContainer(container, width, height);
    this.initPlayCanvas(container, width, height);
    this.initPlaceCanvas(container, width, height);
    this.initVideo();
  }

  // 初始化容器元素
  initContainer(container) {
    container.style.position = 'relative';
    container.style.width = 'fit-content';
  }

  // 初始化摆件画布
  initPlaceCanvas(container, width, height) {
    this.placeCanvas = document.createElement('canvas');
    this.placeCanvas.width = width;
    this.placeCanvas.height = height;

    container.append(this.placeCanvas);

    this.we = new WatermarkEditor(this.placeCanvas);
  }

  // 初始化视频播放 canvas
  initPlayCanvas(container, width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#000';
  }

  // 初始化 video 元素
  initVideo() {
    this.video = document.createElement('video');
    this.video.preload = 'metadata';
    this.videoDrawParams = {
      scale: 1,
      width: this.width,
      height: this.height,
      offsetX: 0,
      offsetY: 0,
    };

    this.vc = new VideoController(this.video);
    this.vc.on('jumped', () => this.play());

    this.video.addEventListener('loadeddata', ev => {
      this.drawVideoTick();

      // 宽高比自适应
      const { videoWidth, videoHeight } = this.video;
      if (this.width / videoWidth > this.height / videoHeight) {
        this.videoDrawParams.scale = this.height / videoHeight;
        this.videoDrawParams.width = this.videoDrawParams.scale * videoWidth;
        this.videoDrawParams.height = this.height;
        this.videoDrawParams.offsetX = (this.width - this.videoDrawParams.width) / 2;
      } else {
        this.videoDrawParams.scale = this.width / videoWidth;
        this.videoDrawParams.width = this.width;
        this.videoDrawParams.height = this.videoDrawParams.scale * videoHeight;
        this.videoDrawParams.offsetY = (this.height - this.videoDrawParams.height) / 2;
      }
    });
  }

  // 加载视频
  loadVideo(src) {
    this.video.src = src;
  }

  // 绘制视频帧
  drawVideoTick() {
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.drawImage(
      this.video,
      this.videoDrawParams.offsetX,
      this.videoDrawParams.offsetY,
      this.videoDrawParams.width,
      this.videoDrawParams.height
    );
  }

  // 连续绘制
  drawVideo() {
    if (!this.vc.playing) {
      this.reqAF = null;
      return;
    }
    this.reqAF = requestAnimationFrame(() => {
      this.drawVideoTick();
      return this.drawVideo();
    });
  }

  // 视频播放
  play() {
    if (!this.vc) return;

    this.vc.play();
    this.drawVideo();
  }

  // 视频暂停
  pause() {
    if (!this.vc) return;

    this.vc.pause();
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
}