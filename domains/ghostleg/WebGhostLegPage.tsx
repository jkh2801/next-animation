import { HomeButton, RoundButton } from '@components/button';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';
import { Result, SettingNum } from './web';
import { GhostLeg, Step } from './web/class';
import { useRouter } from 'next/router';
import { INFO } from './web/iocrops';

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

  const areaWidth = 200;

  const [option, setOption] = useState({
    line: 3,
  });
  const [status, setStatus] = useState('settingNum');
  const [result, setResult] = useState<{ start: string; end: string }[]>([]);
  const router = useRouter();
  useEffect(() => {
    switch (status) {
      case 'settingInput':
        init();
        if (router.query.id === 'iocrops') settingIocrops();
        animate();
        break;
      default:
        break;
    }
  }, [status, option.line]);

  useEffect(() => {
    const { id } = router.query;
    if (id === 'iocrops') {
      setOption({ ...option, line: INFO.length });
      setStatus('settingInput');
    }
  }, [router]);

  const settingIocrops = () => {
    const { data } = ref.current;
    data.forEach((ghostleg: GhostLeg, idx: number) => ghostleg.setText('start', INFO[idx]));
  };

  const init = () => {
    const canvasEle: any = canvas.current;
    ref.current.ctx = canvasEle.getContext('2d');
    ref.current.width = canvasEle.width = canvasEle.clientWidth;
    ref.current.height = canvasEle.height = canvasEle.clientHeight;
    ref.current.cnt = ~~(ref.current.width / areaWidth);
    ref.current.step = new Step(option.line, ref.current.cnt);
    ref.current.data = [];
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
  };

  const handleAddEvent = () => {
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
    const canvasEle: any = canvas.current;
    const { width, height, data, step } = ref.current;
    let cursor = 'default';
    const { offsetX, offsetY } = e;
    data.forEach((ghostleg: GhostLeg) => {
      if (ghostleg.isStartInputPos(offsetX, offsetY)) {
        if (ghostleg.setting === 'settingInput') cursor = 'text';
        else cursor = 'pointer';
      }
      if (ghostleg.isEndInputPos(offsetX, offsetY) && ghostleg.setting === 'settingInput') cursor = 'text';
      if (ghostleg.isClose(offsetX, offsetY) && ghostleg.setting === 'settingInput') cursor = 'pointer';
    });
    if (isCursor(width - 44, height * 0.45 - 9, width - 16, height * 0.45 + 9, offsetX, offsetY) && step.isNext()) cursor = 'pointer';
    if (isCursor(16, height * 0.45 - 9, 44, height * 0.45 + 9, offsetX, offsetY) && step.isPrev()) cursor = 'pointer';
    canvasEle.style.cursor = cursor;
  };

  const handleMouseDownEvent = (e: MouseEvent) => {
    const { width, height, data, step, inputType } = ref.current;
    const { offsetX, offsetY } = e;
    const inputEle: any = input.current;
    let inputState = false;
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
        if (ghostleg.setting === 'settingInput') {
          inputState = true;
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
      }
      if (ghostleg.isEndInputPos(offsetX, offsetY) && ghostleg.setting === 'settingInput') {
        inputState = true;
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
      if (ghostleg.isClose(offsetX, offsetY) && ghostleg.setting === 'settingInput') {
        close = {
          status: true,
          id: ghostleg.id,
        };
        return;
      }
    });
    if (!inputState) {
      inputEle.style.display = 'none';
    }
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
    ctx.fillText('??????', 30, height * 0.45);
  };

  const drawNext = () => {
    const { width, height, ctx } = ref.current;
    // nextBtn
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('??????', width - 30, height * 0.45);
  };

  const handleAddGhostLeg = () => {
    handleRemoveEvent();
    const { width, height, data } = ref.current;
    data.push(new GhostLeg(0, width, height));
    updateLine(data.length);
    handleAddEvent();
    setAlert({
      status: true,
      text: '?????? ??????!',
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

  const handleStartEvent = () => {
    handleRemoveEvent();
    setStatus('start');
    setRandomLine();
    handleAddEvent();
  };

  const setRandomLine = () => {
    const { data } = ref.current;
    data.forEach((ghostLeg: GhostLeg) => ghostLeg.setSetting('start'));
    Array(data.length - 1)
      .fill(1)
      .forEach((_, prevIdx) => {
        if (prevIdx % 2 === 0 && Math.random() > 0.1) setLinkedDdata(prevIdx, 0.15, 0.2);
        if (prevIdx % 2 === 1 && Math.random() > 0.2) setLinkedDdata(prevIdx, 0.25, 0.3);
        if (prevIdx % 2 === 0 && Math.random() > 0.3) setLinkedDdata(prevIdx, 0.35, 0.4);
        if (prevIdx % 2 === 1 && Math.random() > 0.3) setLinkedDdata(prevIdx, 0.45, 0.5);
        if (prevIdx % 2 === 0 && Math.random() > 0.2) setLinkedDdata(prevIdx, 0.55, 0.6);
        if (prevIdx % 2 === 1 && Math.random() > 0.1) setLinkedDdata(prevIdx, 0.65, 0.7);
      });
  };

  const setLinkedDdata = (prevIdx: number, min: number, max: number) => {
    const { data, height } = ref.current;
    const prev = data[prevIdx];
    const prevRandom = getRandomPos(height * min, height * max);
    const nextIdx = prevIdx + 1;
    const next = data[nextIdx];
    const nextRandom = getRandomPos(height * min, height * max);
    prev.addLinkedData({
      link: true,
      idx: prevIdx,
      y: prevRandom,
      linkedData: {
        idx: nextIdx,
        y: nextRandom,
      },
    });
    next.addLinkedData({
      link: true,
      idx: nextIdx,
      y: nextRandom,
      linkedData: {
        idx: prevIdx,
        y: prevRandom,
      },
    });
  };

  const getRandomPos = (prev: number, next: number) => {
    return ~~(Math.random() * (next - prev)) + ~~prev;
  };

  const handleResultEvent = () => {
    const result: { start: string; end: string }[] = [];
    const arr: any = [];
    const { data } = ref.current;
    data.forEach((ghostleg: GhostLeg, idx: number) => {
      result.push({
        start: ghostleg.startInput.text,
        end: '',
      });
      arr.push([
        {
          link: false,
          idx: idx,
          x: ghostleg.x,
          y: ghostleg.height * 0.1,
        },
        ...ghostleg.linkedData,
        {
          link: false,
          idx: idx,
          x: ghostleg.x,
          y: ghostleg.height * 0.8,
        },
      ]);
    });
    arr.forEach((a: any) => a.sort((a: any, b: any) => a.y - b.y));
    result.forEach((info, idx) => {
      let posX = idx;
      let posY = 0;
      let state = true;
      while (state) {
        const next = arr[posX][++posY];
        if (!next.link) {
          state = false;
          info.end = data[next.idx].endInput.text;
        } else {
          const nextIdx = next.linkedData.idx;
          posX = nextIdx;
          posY = arr[nextIdx].findIndex((e: any) => e.y === next.linkedData.y);
        }
      }
    });
    setResult(result);
    setStatus('result');
  };

  return (
    <div className="body flexCenter hidden">
      <HomeButton />
      <div className={styles.container}>
        {status === 'settingNum' && <SettingNum option={option} setLine={setLine} setStatus={setStatus} />}
        <canvas ref={canvas} />
        <input className={styles.inputRef} type="text" value={info.text} onChange={e => setInfo({ ...info, text: e.target.value })} ref={input} />
        {status === 'settingInput' && (
          <div className={cn('flexCenter gap-20', styles.btnBox)}>
            <RoundButton text="+ ????????? ??????" clickEvent={handleAddGhostLeg} color="grey" styleType="typeA" width={200} height={40} />
            <RoundButton text="START" clickEvent={handleStartEvent} styleType="typeA" width={150} height={40} />
          </div>
        )}
        {status === 'start' && (
          <div className={cn('flexCenter gap-20', styles.btnBox)}>
            <RoundButton text="?????? ??????" clickEvent={handleResultEvent} styleType="typeA" width={150} height={40} />
          </div>
        )}
        {status === 'result' && <Result setStatus={setStatus} result={result} />}
        {alert.status && <div className={cn('flexCenter fs-20 fw-500', styles.alertBox)}>{alert.text}</div>}
      </div>
    </div>
  );
};

export default WebGhostLegPage;
