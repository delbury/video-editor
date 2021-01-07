export class WatermarkEditor {
  constructor(canvas) {
    if (!fabric) throw new Error('no fabric.js !');

    this.initCanvas(canvas);
  }

  // 初始化 canvas
  initCanvas(canvas) {
    this.fcanvas = new fabric.Canvas(canvas);
    this.fcanvas.wrapperEl.style.position = 'absolute';
    this.fcanvas.wrapperEl.style.top = '0px';

    const rect = new fabric.Rect({ width: 100, height: 100 });
    this.fcanvas.add(rect);
  }
}