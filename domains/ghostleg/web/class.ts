export class GhostLeg {
  id: string;
  x: number;
  width: number;
  height: number;
  areaWidth = 200;
  startInput = {
    x: 0,
    y: 0,
    text: '',
  };
  endInput = {
    x: 0,
    y: 0,
    text: '',
  };
  close = {
    x: 0,
    y: 0,
  };
  targetPosX: number;
  defaultLineWidth = 3;
  defaultLineColor = '#A6ABCA';
  defaultSpeed = 5;
  constructor(x = 0, width: number, height: number) {
    this.x = x;
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
    this.targetPosX = x;
    this.close = {
      x: x + 200 - 40,
      y: height * 0.03,
    };
    this.id = this.getRandomId();
  }

  getRandomId = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(~~(Math.random() * charactersLength));
    }
    return result;
  };

  updatePos = (x: number) => {
    this.x = x;
    const idx_x = x + this.areaWidth / 2;
    this.startInput.x = idx_x - 50;
    this.endInput.x = idx_x - 50;
    this.targetPosX = x;
    this.close.x = x + 200 - 40;
  };

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
    // close
    ctx.beginPath();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.moveTo(this.close.x, this.close.y);
    ctx.lineTo(this.close.x + 10, this.close.y + 10);
    ctx.moveTo(this.close.x, this.close.y + 10);
    ctx.lineTo(this.close.x + 10, this.close.y);
    ctx.stroke();
    ctx.closePath();
    if (Math.abs(this.targetPosX - this.x) >= 1 + this.defaultSpeed) {
      const dir = Math.sign(this.targetPosX - this.x);
      const vel = dir * this.defaultSpeed;
      this.x += vel;
      this.startInput.x += vel;
      this.endInput.x += vel;
      this.close.x += vel;
    }
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
  isClose = (offsetX: number, offsetY: number) => {
    const isX = this.close.x <= offsetX && offsetX <= this.close.x + 10;
    const isY = this.close.y <= offsetY && offsetY <= this.close.y + 10;
    if (isX && isY) return true;
    return false;
  };

  setText = (type: string, text: string) => {
    if (type === 'start') this.startInput.text = text;
    else this.endInput.text = text;
  };

  setTargetPosX = (x: number) => {
    this.targetPosX += x;
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

  updateTotal = (total: number) => {
    if (total <= this.startIdx + this.cnt) {
      this.startIdx -= 1;
      this.total = total;
    }
  };

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
  prevPos = () => {
    let prevIdx = 0;
    if (this.startIdx - this.cnt > 0) prevIdx = this.startIdx - this.cnt;
    this.startIdx = prevIdx;
    return prevIdx;
  };
}
