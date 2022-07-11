export class GhostLeg {
  x: number;
  y: number;
  width: number;
  height: number;
  areaWidth = 200;
  startInput = {
    x: 0,
    y: 0,
  };
  endInput = {
    x: 0,
    y: 0,
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
    };
    this.endInput = {
      x: idx_x - 50,
      y: height * 0.8,
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
  };

  isStartInputPos = (offsetX: number, offsetY: number) => {
    const isX = this.startInput.x <= offsetX && offsetX <= this.startInput.x + 100;
    const isY = this.startInput.y <= offsetY && offsetY <= this.startInput.y + this.height * 0.05;
    if (isX && isY) return true;
    return false;
  };
}
