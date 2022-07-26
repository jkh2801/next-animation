export class Cell {
  x = 0;
  y = 0;
  type = 'none';
  text = '';
  unitLength = 30;

  constructor(x: number, y: number, type = 'none', text = '') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.text = text;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    switch (this.type) {
      case 'none':
        ctx.fillStyle = '#ffc08a';
        ctx.fillRect(this.x, this.y, this.unitLength, this.unitLength);
        ctx.strokeStyle = '#ff7600';
        ctx.strokeRect(this.x, this.y, this.unitLength, this.unitLength);
        break;
      case 'header':
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.unitLength, this.unitLength);
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(this.x, this.y, this.unitLength, this.unitLength);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.font = '700 11px sans-serif';
        ctx.fillText(this.text, this.x + this.unitLength / 2, this.y + this.unitLength / 2);
        break;
      case 'cell':
        ctx.fillStyle = '#e9fdfc';
        ctx.fillRect(this.x, this.y, this.unitLength, this.unitLength);
        ctx.strokeStyle = '#08c7bd';
        ctx.strokeRect(this.x, this.y, this.unitLength, this.unitLength);
        break;
    }
  };
}
