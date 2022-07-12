export class GhostLeg {
  x: number;
  y: number;
  width: number;
  height: number;
  areaWidth = 200;
  startInput = {
    x: 0,
    y: 0,
    text: 'dddd',
  };
  endInput = {
    x: 0,
    y: 0,
    text: '',
  };
  defaultLineWidth = 3;
  defaultLineColor = '#A6ABCA';
  constructor(x = 0, y = 0, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    const idx_x = x + this.areaWidth / 2;
    this.startInput = {
      x: idx_x - 50,
      y: height * 0.05,
      text: '',
    };
    this.endInput = {
      x: idx_x - 50,
      y: height * 0.8,
      text: '',
    };
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const idx_x = this.x + 200 / 2;
    // startInput
    ctx.beginPath();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.rect(this.startInput.x, this.startInput.y, 100, this.height * 0.05);
    ctx.stroke();
    ctx.closePath();
    // startFont
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText(this.startInput.text, this.startInput.x + 50, this.height * 0.075);
    // leg
    ctx.beginPath();
    ctx.lineWidth = this.defaultLineWidth;
    ctx.strokeStyle = this.defaultLineColor;
    ctx.moveTo(idx_x, this.height * 0.1);
    ctx.lineTo(idx_x, this.height * 0.8);
    ctx.stroke();
    ctx.closePath();
    // endInput
    ctx.beginPath();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.rect(this.endInput.x, this.endInput.y, 100, this.height * 0.05);
    ctx.stroke();
    ctx.closePath();
    // endFont
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText(this.endInput.text, this.endInput.x + 50, this.height * 0.825);
  };

  isStartInputPos = (offsetX: number, offsetY: number) => {
    const isX = this.startInput.x <= offsetX && offsetX <= this.startInput.x + 100;
    const isY = this.startInput.y <= offsetY && offsetY <= this.startInput.y + this.height * 0.05;
    if (isX && isY) return true;
    return false;
  };
  isEndInputPos = (offsetX: number, offsetY: number) => {
    const isX = this.endInput.x <= offsetX && offsetX <= this.endInput.x + 100;
    const isY = this.endInput.y <= offsetY && offsetY <= this.endInput.y + this.height * 0.05;
    if (isX && isY) return true;
    return false;
  };

  setText = (type: string, text: string) => {
    if (type === 'start') this.startInput.text = text;
    else this.endInput.text = text;
  };
}

export class Step {
  startIdx = 0;
  total: number;
  cnt: number;
  constructor(total: number, cnt: number) {
    this.total = total;
    this.cnt = cnt;
  }
  isNext = () => {
    return this.startIdx + this.cnt === this.total || this.total <= this.cnt ? false : true;
  };
  isPrev = () => {
    return this.startIdx === 0 || this.total <= this.cnt ? false : true;
  };
  nextPos = () => {
    let nextIdx = 0;
    if (this.startIdx + 2 * this.cnt <= this.total) nextIdx = this.startIdx + this.cnt;
    else nextIdx = this.total - this.cnt;
    this.startIdx = nextIdx;
    return nextIdx;
  };
  PrevPos = () => {
    let prevIdx = 0;
    if (this.startIdx > 0) prevIdx = this.startIdx - this.cnt;
    this.startIdx = prevIdx;
    return prevIdx;
  };
}
