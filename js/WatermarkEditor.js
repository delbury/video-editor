export class WatermarkEditor {
  #fimages = [];
  #ftexts = [];
  constructor(canvas) {
    if (!fabric) throw new Error('no fabric.js !');

    this.initCanvas(canvas);
  }

  // 初始化 canvas
  initCanvas(canvas) {
    this.canvas = canvas;
    this.fcanvas = new fabric.Canvas(canvas);
    this.fcanvas.wrapperEl.style.position = 'absolute';
    this.fcanvas.wrapperEl.style.top = '0px';
  }

  // 生成图片
  createDataURL() {
    return {
      data: this.fcanvas.toDataURL({
        format: 'png',
      }),
      width: this.width,
      height: this.height,
    }
  }

  // 添加文本
  addText(text, callback) {
    const ftext = new fabric.IText(text ?? '添加文本');
    ftext.setControlsVisibility({ mb: false, mt: false, mr: false, ml: false });
    ftext.on('selected', this.handleSelected);
    this.fcanvas.add(ftext);
    this.#ftexts.push(ftext);
    callback && callback(this.#ftexts);
  }

  // 移除文本
  removeTextByIndex(index, callback) {
    this.fcanvas.remove(this.#ftexts[index]);
    this.#ftexts.splice(index, 1);
    callback && callback(this.#ftexts);
  }

  // 添加图片
  addImage(source, callback) {
    if(!source) return;

    if(source instanceof Image) {
      const fimg = new fabric.Image(source, { ...this.initImageSize(source) });
      fimg.setControlsVisibility({ mb: false, mt: false, mr: false, ml: false });
      fimg.on('selected', this.handleSelected);
      this.fcanvas.add(fimg);
      this.#fimages.push(fimg);
      
      callback && callback(this.#fimages);
    } else {
      const img = new Image();
      img.onload = ev => {
        const fimg = new fabric.Image(img, { ...this.initImageSize(img) });
        fimg.setControlsVisibility({ mb: false, mt: false, mr: false, ml: false });
        fimg.on('selected', this.handleSelected);
        this.fcanvas.add(fimg);
        this.#fimages.push(fimg);

        callback && callback(this.#fimages);
      };

      if(typeof source === 'string') {
        img.src = source;
      } else if(source instanceof File) {
        const url = URL.createObjectURL(source);
        img.src = url;
      }
    }
  }

  // 移除图片
  removeImage(fimg, callback) {
    const index = this.#fimages.indexOf(fimg);
    if(index === -1) return;

    this.fcanvas.remove(fimg);
    this.#fimages.splice(index, 1);
    callback && callback(this.#fimages);
  }

  // 移除图片
  removeImageByIndex(index, callback) {
    this.fcanvas.remove(this.#fimages[index]);
    this.#fimages.splice(index, 1);
    callback && callback(this.#fimages);
  }

  // 调整添加的图片大小
  initImageSize(image) {
    if(image.height > this.height / 2) {
      const scale = (this.height / 2) / image.height;
      return {
        scaleX: scale,
        scaleY: scale,
      };
    }
    return {};
  }

  // 移动到顶层
  moveToTop(fobj) {
    this.fcanvas.moveTo(fobj, this.fcanvas._objects.length - 1);
  }

  // 选中回调
  handleSelected = (ev) => {
    setTimeout(() => {
      if(ev.selected.length === 1) {
        this.moveToTop(ev.selected[0]);
      }
    });
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
}