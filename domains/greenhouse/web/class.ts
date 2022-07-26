export class Cell {
  x = 0;
  y = 0;
  type = 'none';
  text = '';

  constructor(x: number, y: number, type = 'none', text = '') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.text = text;
  }

  draw = (ctx: CanvasRenderingContext2D, unitLength: number, type = '') => {
    ctx.beginPath();
    const x = this.x * unitLength;
    const y = this.y * unitLength;
    switch (this.type) {
      case 'none':
        ctx.fillStyle = '#ffc08a';
        ctx.fillRect(x, y, unitLength, unitLength);
        ctx.strokeStyle = '#ff7600';
        ctx.strokeRect(x, y, unitLength, unitLength);
        break;
      case 'header':
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, unitLength, unitLength);
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(x, y, unitLength, unitLength);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.font = '700 11px sans-serif';
        ctx.fillText(this.text, x + unitLength / 2, y + unitLength / 2);
        break;
      case 'cell':
        if (type === 'mouseover') {
          ctx.fillStyle = '#a8cbff';
          ctx.strokeStyle = '#0066ff';
        } else if (type === 'selected') {
          ctx.fillStyle = '#00ffbf';
        } else {
          ctx.fillStyle = '#e9fdfc';
          ctx.strokeStyle = '#08c7bd';
        }
        ctx.fillRect(x, y, unitLength, unitLength);
        ctx.strokeRect(x, y, unitLength, unitLength);
        break;
    }
  };
}
