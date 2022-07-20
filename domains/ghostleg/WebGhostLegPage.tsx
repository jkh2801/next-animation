import { RoundButton } from '@components/button';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';
import { SettingNum } from './web';
import { GhostLeg, Step } from './web/class';

type RefType = {
  ctx: any;
  width: number;
  height: number;
  data: GhostLeg[];
  cnt: number;
  step: any;
  inputType: {
    idx: number;
    type: string;
  };
};

const WebGhostLegPage = () => {
  const canvas = useRef(null);
  const input = useRef<HTMLInputElement>(null);

  const [info, setInfo] = useState({
    text: '',
  });

  const [alert, setAlert] = useState({
    status: false,
    text: '',
  });

  const ref = useRef<RefType>({
    ctx: null,
    width: 0,
    height: 0,
    data: [],
    cnt: 0,
    step: null,
    inputType: {
      idx: 0,
      type: 'start',
    },
  });

  let lineData = [];
  const defaultLineWidth = 3;
  const defaultLineColor = '#A6ABCA';
  const areaWidth = 200;

  const [option, setOption] = useState({
    line: 3,
  });
  const [status, setStatus] = useState('settingNum');

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

    ref.current.ctx = canvasEle.getContext('2d');
    ref.current.width = canvasEle.width = canvasEle.clientWidth;
    ref.current.height = canvasEle.height = canvasEle.clientHeight;
    ref.current.cnt = ~~(ref.current.width / areaWidth);
    ref.current.step = new Step(option.line, ref.current.cnt);

    const { width, height, cnt, data } = ref.current;

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
    handleAddEvent();
  };

  const animate = () => {
    const { width, height, data, step, ctx } = ref.current;
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    data.forEach((ghostleg: GhostLeg) => {
      ghostleg.draw(ctx);
    });
    if (step.isPrev()) drawPrev();
    if (step.isNext()) drawNext();
    // drawLine();
  };

  const handleAddEvent = () => {
    console.log('handleAddEvent');
    const canvasEle: any = canvas.current;
    canvasEle.addEventListener('mousemove', handleMouseMoveEvent);
    canvasEle.addEventListener('mousedown', handleMouseDownEvent);
  };

  const handleRemoveEvent = () => {
    const canvasEle: any = canvas.current;
    canvasEle.removeEventListener('mousemove', handleMouseMoveEvent);
    canvasEle.removeEventListener('mousedown', handleMouseDownEvent);
  };

  const handleMouseMoveEvent = (e: MouseEvent) => {
    console.log('handleMouseMoveEvent');
    const canvasEle: any = canvas.current;
    const { width, height, data, step } = ref.current;
    let cursor = 'default';
    const { offsetX, offsetY } = e;
    data.forEach((ghostleg: GhostLeg) => {
      if (ghostleg.isStartInputPos(offsetX, offsetY) || ghostleg.isEndInputPos(offsetX, offsetY)) cursor = 'text';
      if (ghostleg.isClose(offsetX, offsetY)) cursor = 'pointer';
    });
    if (isCursor(width - 44, height * 0.45 - 9, width - 16, height * 0.45 + 9, offsetX, offsetY) && step.isNext()) cursor = 'pointer';
    if (isCursor(16, height * 0.45 - 9, 44, height * 0.45 + 9, offsetX, offsetY) && step.isPrev()) cursor = 'pointer';
    canvasEle.style.cursor = cursor;
  };

  const handleMouseDownEvent = (e: MouseEvent) => {
    console.log('handleMouseDownEvent');
    const { width, height, data, step, inputType } = ref.current;
    const { offsetX, offsetY } = e;
    const inputEle: any = input.current;
    let status = false;
    let close = {
      status: false,
      id: '',
    };

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
        ref.current.inputType = {
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
        ref.current.inputType = {
          idx: idx,
          type: 'end',
        };
        setInfo({ ...info, text: ghostleg.endInput.text });
        return;
      }
      if (ghostleg.isClose(offsetX, offsetY)) {
        close = {
          status: true,
          id: ghostleg.id,
        };
        return;
      }
    });

    if (close.status) {
      ref.current.inputType = {
        idx: 0,
        type: 'start',
      };
      handleRemoveEvent();
      ref.current.data = ref.current.data.filter((g: GhostLeg) => g.id !== close.id);
      updateLine(ref.current.data.length);
      handleAddEvent();
    }

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
      const curX = data[curIdx].x;
      const nextX = data[nextIdx].x;
      data.forEach((ghostleg: GhostLeg) => {
        ghostleg.setTargetPosX(curX - nextX);
      });
    }
  };

  const drawPrev = () => {
    const { height, ctx } = ref.current;
    // prevBtn
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('이전', 30, height * 0.45);
  };

  const drawNext = () => {
    const { width, height, ctx } = ref.current;
    // nextBtn
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('다음', width - 30, height * 0.45);
  };

  const handleAddGhostLeg = () => {
    handleRemoveEvent();
    const { width, height, data } = ref.current;
    data.push(new GhostLeg(0, width, height));
    updateLine(data.length);
    // handleAddEvent();
    setAlert({
      status: true,
      text: '추가 완료!',
    });
    setTimeout(() => {
      setAlert({
        status: false,
        text: '',
      });
    }, 1000);
  };

  const updateLine = (total: number) => {
    const { width, step, data, cnt } = ref.current;
    step.updateTotal(total);
    data.forEach((ghostleg: GhostLeg, idx: number) => {
      let posX = 0;
      if (cnt >= total) posX = (width - total * areaWidth) / 2 + idx * areaWidth;
      else {
        if (idx < cnt) posX = (width - cnt * areaWidth) / 2 + idx * areaWidth;
        else posX = (width - cnt * areaWidth) / 2 + cnt * areaWidth + (idx - cnt) * areaWidth;
      }
      ghostleg.updatePos(posX - step.startIdx * areaWidth);
    });
  };

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
        {status === 'settingInput' && (
          <div className={cn('flexCenter gap-20', styles.btnBox)}>
            <RoundButton text="+ 사다리 추가" clickEvent={handleAddGhostLeg} color="grey" styleType="typeA" width={200} height={40} />
            <RoundButton text="START" clickEvent={() => {}} styleType="typeA" width={150} height={40} />
          </div>
        )}
        {alert.status && <div className={cn('flexCenter fs-20 fw-500', styles.alertBox)}>{alert.text}</div>}
      </div>
    </div>
  );
};

export default WebGhostLegPage;
