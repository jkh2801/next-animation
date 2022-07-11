import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';
import { SettingNum } from './web';
import { GhostLeg } from './web/class';

type DataType = {
  x: number;
  y: number;
  dataIndex?: number;
  linkIdx?: string;
  object?: {
    x: number;
    y: number;
  };
  originX?: number;
  originY?: number;
};

const WebGhostLegPage = () => {
  const canvas = useRef(null);
  const input = useRef(null);
  const [text, setText] = useState('');

  let ctx: CanvasRenderingContext2D;
  let width: number;
  let height: number;
  let data: any = [];
  let lineData = [];
  const defaultLineWidth = 3;
  const defaultLineColor = '#A6ABCA';
  let cnt: number;
  const areaWidth = 200;

  const [option, setOption] = useState({
    line: 20,
  });
  const [status, setStatus] = useState('settingNum');
  let camera = {
    x: 0,
    y: 0,
  };

  useEffect(() => {
    switch (status) {
      case 'settingInput':
        init();
        animate();
        break;
      default:
        break;
    }
  }, [status, option.line]);

  const init = () => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    width = canvasEle.width = canvasEle.clientWidth;
    height = canvasEle.height = canvasEle.clientHeight;
    cnt = ~~(width / areaWidth);
    console.log(cnt);
    Array(option.line)
      .fill(1)
      .forEach((_, idx) => {
        let posX = 0;
        if (cnt >= option.line) posX = (width - option.line * areaWidth) / 2 + idx * areaWidth;
        else {
          if (idx < cnt) posX = (width - cnt * areaWidth) / 2 + idx * areaWidth;
          else posX = (width - cnt * areaWidth) / 2 + cnt * areaWidth + (idx - cnt) * areaWidth;
        }
        data.push(new GhostLeg(posX, 0, width, height));
      });
    canvasEle.addEventListener('mousemove', (e: MouseEvent) => {
      let cursor = 'default';
      const { offsetX, offsetY } = e;
      data.forEach((ghostleg: GhostLeg) => {
        if (ghostleg.isStartInputPos(offsetX, offsetY)) cursor = 'text';
      });
      canvasEle.style.cursor = cursor;
    });
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    data.forEach((ghostleg: GhostLeg) => {
      ghostleg.draw(ctx);
    });
    console.log(data);
    // drawLine();
  };

  const drawLine = () => {
    const line = option.line;
    for (let i = 0; i < line; i++) {
      let startPosX = (i / line) * width + ((1 / line) * width) / 2;
      console.log(startPosX);
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.beginPath();
      ctx.lineWidth = defaultLineWidth;
      ctx.strokeStyle = defaultLineColor;
      ctx.moveTo(startPosX, height * 0.1);
      ctx.lineTo(startPosX, height * 0.8);
      ctx.stroke();
      ctx.closePath();

      ctx.restore();
      let arr = [
        { x: startPosX, y: height * 0.1 },
        { x: startPosX, y: height * 0.8 },
      ];
      data.push(arr);
    }

    // sort();
  };

  // const sort = () => {
  //   data.map(arg => {
  //     return arg.sort((a, b) => a.y - b.y);
  //   });
  // };

  const setLine = (num: number) => {
    if (num > 0) setOption({ ...option, line: num });
  };

  return (
    <div className="body flexCenter hidden">
      <div className={styles.container}>
        {status === 'settingNum' && <SettingNum option={option} setLine={setLine} setStatus={setStatus} />}
        <canvas ref={canvas} />
        <input className={styles.refInput} type="text" value={text} onChange={e => setText(e.target.value)} ref={input} />
      </div>
    </div>
  );
};

export default WebGhostLegPage;
