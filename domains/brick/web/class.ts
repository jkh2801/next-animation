export class Ball {
  x: number;
  y: number;
  size = 10;
  speed = 4;
  dx = 1;
  dy = 4;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  setDx = (dx: number) => {
    this.dx = dx;
  };
  setDy = (dy: number) => {
    this.dy = dy;
  };
  setX = (x: number) => {
    this.x = x;
  };
  setY = (y: number) => {
    this.y = y;
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
  };
}

export class Paddle {
  x: number;
  y: number;
  w = 120;
  h = 10;
  speed = 20;
  dx = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
  };

  setDx = (x: number) => {
    this.dx = x;
  };

  setX = (x: number) => {
    this.x = x;
  };
}

export class Brick {
  w = 70;
  h = 20;
  padding = 10;
  offsetX = 45;
  offsetY = 60;
  visible = true;
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  setVisible = (visible: boolean) => {
    this.visible = visible;
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
  };
}
