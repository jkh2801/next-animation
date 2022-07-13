import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';
import { SettingNum } from './web';
import { GhostLeg, Step } from './web/class';

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
  const input = useRef<HTMLInputElement>(null);
  let inputType = {
    idx: 0,
    type: 'start',
  };
  const [info, setInfo] = useState({
    text: '',
  });

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
    line: 7,
  });
  const [status, setStatus] = useState('settingNum');
  let step: Step;
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
    step = new Step(option.line, cnt);
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
        data.push(new GhostLeg(posX, width, height));
      });
    canvasEle.addEventListener('mousemove', (e: MouseEvent) => {
      let cursor = 'default';
      const { offsetX, offsetY } = e;
      data.forEach((ghostleg: GhostLeg) => {
        if (ghostleg.isStartInputPos(offsetX, offsetY) || ghostleg.isEndInputPos(offsetX, offsetY)) cursor = 'text';
      });
      if (isCursor(width - 44, height * 0.45 - 9, width - 16, height * 0.45 + 9, offsetX, offsetY) && step.isNext()) cursor = 'pointer';
      if (isCursor(16, height * 0.45 - 9, 44, height * 0.45 + 9, offsetX, offsetY) && step.isPrev()) cursor = 'pointer';
      canvasEle.style.cursor = cursor;
    });
    canvasEle.addEventListener('mousedown', (e: MouseEvent) => {
      const { offsetX, offsetY } = e;
      const inputEle: any = input.current;
      let status = false;
      if (inputEle.value) {
        data[inputType.idx].setText(inputType.type, inputEle.value);
        setInfo({ ...info, text: '' });
      }
      data.forEach((ghostleg: GhostLeg, idx: number) => {
        if (ghostleg.isStartInputPos(offsetX, offsetY)) {
          status = true;
          const { startInput } = ghostleg;
          inputEle.style.display = 'block';
          inputEle.style.left = startInput.x + 'px';
          inputEle.style.top = startInput.y + 'px';
          inputType = {
            idx: idx,
            type: 'start',
          };
          setInfo({ ...info, text: ghostleg.startInput.text });
          return;
        }
        if (ghostleg.isEndInputPos(offsetX, offsetY)) {
          status = true;
          const { endInput } = ghostleg;
          inputEle.style.display = 'block';
          inputEle.style.left = endInput.x + 'px';
          inputEle.style.top = endInput.y + 'px';
          inputType = {
            idx: idx,
            type: 'end',
          };
          setInfo({ ...info, text: ghostleg.endInput.text });
          return;
        }
      });
      if (!status) {
        inputEle.style.display = 'none';
        inputEle.style.left = 1000 + 'px';
        inputEle.style.top = 1000 + 'px';
      }
      if (isCursor(width - 44, height * 0.45 - 9, width - 16, height * 0.45 + 9, offsetX, offsetY) && step.isNext()) {
        const curIdx = step.startIdx;
        const nextIdx = step.nextPos();
        const curX = data[curIdx].x;
        const nextX = data[nextIdx].x;
        data.forEach((ghostleg: GhostLeg) => {
          ghostleg.setTargetPosX(curX - nextX);
        });
      }
      if (isCursor(16, height * 0.45 - 9, 44, height * 0.45 + 9, offsetX, offsetY) && step.isPrev()) {
        const curIdx = step.startIdx;
        const nextIdx = step.prevPos();
        console.log(curIdx, nextIdx);
        const curX = data[curIdx].x;
        const nextX = data[nextIdx].x;
        data.forEach((ghostleg: GhostLeg) => {
          ghostleg.setTargetPosX(curX - nextX);
        });
      }
    });
  };

  const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    data.forEach((ghostleg: GhostLeg) => {
      ghostleg.draw(ctx);
    });
    if (step.isPrev()) drawPrev();
    if (step.isNext()) drawNext();
    // drawLine();
  };

  const drawPrev = () => {
    // prevBtn
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('이전', 30, height * 0.45);
  };

  const drawNext = () => {
    // nextBtn
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('다음', width - 30, height * 0.45);
  };
  const drawLine = () => {
    const line = option.line;
    for (let i = 0; i < line; i++) {
      let startPosX = (i / line) * width + ((1 / line) * width) / 2;
      console.log(startPosX);
      ctx.save();
      // ctx.translate(camera.x, camera.y);
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

  const isCursor = (x1: number, y1: number, x2: number, y2: number, x: number, y: number) => {
    const isX = x1 <= x && x <= x2;
    const isY = y1 <= y && y <= y2;
    if (isX && isY) return true;
    return false;
  };

  return (
    <div className="body flexCenter hidden">
      <div className={styles.container}>
        {status === 'settingNum' && <SettingNum option={option} setLine={setLine} setStatus={setStatus} />}
        <canvas ref={canvas} />
        <input className={styles.inputRef} type="text" value={info.text} onChange={e => setInfo({ ...info, text: e.target.value })} ref={input} />
      </div>
    </div>
  );
};

export default WebGhostLegPage;
