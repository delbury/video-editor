import { Event } from './Event.js';

/**
 * events:
 *  loadeddata
 *  timeupdate
 *  jumped
 */
export class VideoController extends Event {
  #ranges = [[0, 0]]; // 播放范围
  constructor(video) {
    super();
    this.initController(video);
  }

  // 时间格式化，xxx => yy:yy
  static formatTime(seconds) {
    seconds = Math.round(seconds);
    const sec = (seconds % 60).toString().padStart(2, '0');
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  // 初始化
  initController(video) {
    this.video = video;
    this.videoInfo = {
      formatedDuration: 0,
    };

    // 首帧加载
    this.video.addEventListener('loadedmetadata', ev => {
      this.videoInfo.formatedDuration = VideoController.formatTime(this.video.duration);
      this.setRange(0, this.video.duration)

      this.emit('loadedmetadata', {
        videoElement: this.video,
        percent: 0,
        currentTime: 0,
        duration: this.video.duration,
        formatedCurrentTime: VideoController.formatTime(this.video.currentTime),
        formatedDuration: this.videoInfo.formatedDuration,
      });
    });

    // 播放时间更新
    this.video.addEventListener('timeupdate', ev => {
      const [start, end] = this.getRange();
      if(this.video.currentTime < start || this.video.currentTime > end) {
        this.video.currentTime = start;
      }

      this.emit('timeupdate', {
        videoElement: this.video,
        percent: this.video.currentTime / this.video.duration * 100,
        currentTime: this.video.currentTime,
        duration: this.video.duration,
        formatedCurrentTime: VideoController.formatTime(this.video.currentTime),
        formatedDuration: this.videoInfo.formatedDuration,
      });
    });

    // 
  }

  // 视频跳转百分比
  jumpVideoByPercent(percent) {
    this.video.currentTime = this.video.duration * (percent / 100);
    this.emit('jumped');
  }

  // 视频跳转具体时间
  jumpVideoByTime(time) {
    this.video.currentTime = time;
    this.emit('jumped');
  }

  // 获取播放范围
  getRange(index = 0) {
    return this.#ranges[index];
  }
  getRanges() {
    return this.#ranges;
  }

  // 设置播放范围
  setRange(start, end , index = 0) {
    this.#ranges[index] = [start, end];
  }

  // 设置播放范围（百分比）
  setRangePercent(start, end , index = 0) {
    this.#ranges[index] = [start * this.video.duration, end * this.video.duration];
  }

  play() {
    this.video.play();
  }
  pause() {
    this.video.pause();
  }

  get playing() {
    return this.video ? !this.video.paused : false;
  }
}