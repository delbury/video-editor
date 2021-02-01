/**
 * events:
 *  rangechange: ({ start: number, end: number }) => void, 选中范围改变
 */
export default class DelTicks extends HTMLElement {
  static tagName = 'del-ticks';
  constructor(props) {
    super();

    this.params = {
      maxWidth: 800,
      left: 0,
      width: 800,
      borderWidth: 8,
    };
    this.resizing = false; // 是否正在拖动
    this.hoveringType = ''; // left, center, right
    this.resizingType = ''; // left, center, right
    this.originX = 0;
    this.originLeft = 0;
    this.originWidth = 0;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position: relative; width: ${this.params.maxWidth}px; height: 50px; border: 1px dashed skyblue; border-top: none; display: flex; justify-content: center; align-items: center; font-size: 0; overflow: hidden;`;
    this.img = document.createElement('div');
    // this.img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
    this.img.style.cssText = 'width: 100%; height: 100%; background-repeat: no-repeat; background-size: contain;';

    this.range = document.createElement('div');
    this.range.style.cssText = 'position: absolute; top: 0; bottom: 0; background-repeat: no-repeat; background-size: contain; user-select: none;';
    this.range.style.left = `${this.params.left}px`;
    this.range.style.width = `${this.params.width}px`;
    this.range.style.outline = `${this.params.maxWidth}px solid rgba(0, 0, 0, 0.75)`;

    this.range.innerHTML = `<div style="pointer-events: none; box-sizing: border-box; width: 100%; height: 100%; border: 2px solid orange; border-width: 2px ${this.params.borderWidth}px;"></div>`;

    // 移动事件
    this.range.onmousemove = ev => {
      if(!this.resizing) {
        if(ev.offsetX >= 0 && ev.offsetX <= this.params.borderWidth) {
          // 左边框
          document.body.style.cursor = 'ew-resize';
          this.hoveringType = 'left';
  
        } else if(ev.offsetX >= this.width - this.params.borderWidth && ev.offsetX <= this.width) {
          // 右边框
          document.body.style.cursor = 'ew-resize';
          this.hoveringType = 'right';
  
        } else {
          // 中间
          document.body.style.cursor = 'move';
          this.hoveringType = 'center';
        }
      }
    };

    // 鼠标点击
    this.range.onmousedown = ev => {
      if(this.hoveringType) {
        this.resizingType = this.hoveringType;
        this.resizing = true;
        this.originX = ev.pageX;
        this.originLeft = this.left;
        this.originWidth = this.width;


        const fnMove = (ev) => {
          // 拖动、改变大小
            const dx = ev.pageX - this.originX;
            if(this.resizingType === 'left') {
            const left = this.originLeft + dx;
            const width = this.originWidth - dx;
            if(width > 0 && left >= 0) {
              this.left = left;
              this.width = width;
            } else if(left < 0) {
              this.left = 0;
              this.width = width + left
            }
          } else if(this.resizingType === 'right') {
            const width = this.originWidth + dx;
            const right = this.left + width;
            if(width > 0 && right <= this.params.maxWidth) {
              this.width = width;
            } else if(right > this.params.maxWidth) {
              this.width = this.params.maxWidth - this.left;
            }
          } else if(this.resizingType === 'center') {
            const left = this.originLeft + dx;

            if(left < 0) {
              this.left = 0;
            } else if(left + this.width > this.params.maxWidth) {
              this.left = this.params.maxWidth - this.width;
            } else {
              this.left = left;
            }
          }

          // 触发事件
          const event = new CustomEvent('rangechange', { detail: this.getRange() });
          this.dispatchEvent(event);
        };

        const fnUp = () => {
          document.removeEventListener('mousemove', fnMove);
          document.removeEventListener('mouseup', fnUp);
        };
        
        document.addEventListener('mousemove', fnMove);
        document.addEventListener('mouseup', fnUp)
      }
    };

    // 鼠标离开
    this.range.onmouseleave = ev => {
      if(!this.resizing) {
        document.body.style.cursor = '';
      }
    };

    // 鼠标抬起
    document.addEventListener('mouseup', ev => {
      this.resizing = false;
      this.resizingType = '';
      document.body.style.cursor = '';
    });

    // this.range.style.display = 'none';

    wrapper.append(this.img, this.range);
    this.append(wrapper);

    // this.setSrc();
  }

  setSrc(url = '//127.0.0.1:3000/ticks.jpg') {
    // this.img.src = url;
    this.img.style.backgroundImage = `url(${url})`;
  }

  getRange() {
    return {
      start: this.left / this.params.maxWidth,
      end: (this.left + this.width) / this.params.maxWidth,
    };
  }

  get left() {
    return this.params.left;
  }
  set left(val) {
    this.range.style.left = val + 'px';
    this.params.left = val;
  }
  get width() {
    return this.params.width;
  }
  set width(val) {
    this.range.style.width = val + 'px';
    this.params.width = val;
  }
}