import { Event } from './Event.js';

/**
 * events:
 *  loadeddata
 *  timeupdate
 *  jumped
 */
export class VideoController extends Event {
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
    
    this.video.addEventListener('loadeddata', ev => {
      this.videoInfo.formatedDuration = VideoController.formatTime(this.video.duration);
      this.emit('loadeddata', {
        videoElement: this.video,
        percent: 0,
        currentTime: 0,
        duration: this.video.duration,
        formatedCurrentTime: VideoController.formatTime(this.video.currentTime),
        formatedDuration: this.videoInfo.formatedDuration,
      });
    });

    this.video.addEventListener('timeupdate', ev => {
      this.emit('timeupdate', {
        videoElement: this.video,
        percent: this.video.currentTime / this.video.duration * 100,
        currentTime: this.video.currentTime,
        duration: this.video.duration,
        formatedCurrentTime: VideoController.formatTime(this.video.currentTime),
        formatedDuration: this.videoInfo.formatedDuration,
      });
    });
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