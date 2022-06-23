import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';
import LeftArrowIcon from '@assets/leftArrowIcon.svg';
import RightArrowIcon from '@assets/rightArrowIcon.svg';

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

  let ctx: any;
  let width: number;
  let height: number;
  let data: DataType[][] = [];
  let lineData = [];
  const defaultLineWidth = 3;
  const defaultLineColor = '#A6ABCA';

  const [option, setOption] = useState({
    line: 20,
  });
  const [status, setStatus] = useState('settingNum');
  useEffect(() => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    width = canvasEle.clientWidth;
    height = canvasEle.clientHeight;
    console.log(width, height);
    // init();
    // drawLine();
  }, []);

  useEffect(() => {
    switch (status) {
      case 'settingNum':
        break;

      default:
        break;
    }
  }, [status]);

  const init = () => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  };

  const drawLine = () => {
    const line = option.line;
    for (let i = 0; i < line; i++) {
      let startPosX = (i / line) * width + ((1 / line) * width) / 2;
      console.log(startPosX);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = defaultLineWidth;
      ctx.strokeStyle = defaultLineColor;
      ctx.moveTo(startPosX, height * 0.1);
      ctx.lineTo(startPosX, height * 0.9);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      let arr = [
        { x: startPosX, y: height * 0.1 },
        { x: startPosX, y: height * 0.9 },
      ];
      data.push(arr);
    }

    sort();
  };

  const sort = () => {
    data.map(arg => {
      return arg.sort((a, b) => a.y - b.y);
    });
  };

  const setLine = (num: number) => {
    if (num > 0) setOption({ ...option, line: num });
  };

  return (
    <div className="body flexCenter hidden">
      <div className={styles.container}>
        <canvas id="canvas" ref={canvas} />
        {status === 'settingNum' && (
          <div className={cn('flexCenter', styles.blockBox)}>
            <div className={cn('flexColumn gap-20')}>
              <span className="flexCenter fs-40 fw-700">사다리타기</span>
              <div className={cn('flexCenter gap-20', styles.numBox)}>
                <div className={styles.btnBox}>
                  {option.line > 1 && (
                    <button className="flexCenter" onClick={() => setLine(option.line - 1)}>
                      <LeftArrowIcon />
                    </button>
                  )}
                </div>
                <div className={styles.inputBox}>
                  <input type="number" value={option.line} className="number fs-30 fw-700" min={1} onChange={e => setLine(Number(e.target.value))} />
                </div>
                <div className={styles.btnBox}>
                  <button className="flexCenter" onClick={() => setLine(option.line + 1)}>
                    <RightArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebGhostLegPage;
