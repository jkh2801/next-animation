import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './GhostLeg.module.scss';

const WebGhostLegPage = () => {
  const canvas = useRef(null);
  const [option, setOption] = useState({
    line: 5,
  });
  useEffect(() => {
    if (canvas.current) {
      const canvasEle: any = canvas.current;
      let width: number = canvasEle.clientWidth;
      let height: number = canvasEle.clientHeight;

      let ctx = canvasEle.getContext('2d');
      let line = option.line; //line

      let calback; //콜백용 변수 입니다
      let data: any = []; //모든 데이터가 y축 기준으로 정렬된 배열 입니다
      let lineData: any = []; //선이 그려지고 난 뒤에 보관되는 배열 입니다
      //마우스 다운여부 변수 입니다
      let isClicked = false;
      //마우스가 다운되면서 그리는 경우 끝지점을 담는 변수 입니다
      let hoverPosition = {};
      //마우스 다운인 경우에 처음 기록하는 시작지점 입니다
      let startBridge: any = null;

      //기본 선 굵기와 색상 입니다
      let defaultLineWidth = 3;
      let defaultLineColor = '#A6ABCA';

      let bk = 1; //혹시모를 무한재귀 대비 브레이킹 인덱스 입니다
      let historyIndex = []; //히스토리 배열입니다. 이미 지나온 구간은 안가기 위해서 사용 합니다

      _init(ctx, width, height);
      _drawLine(ctx, line, width, height, defaultLineWidth, defaultLineColor, data);

      //마우스가 움직일 때 이벤트 입니다
      canvasEle.addEventListener('mousemove', (event: any) => {
        if (!ctx) return;
        if (isClicked) {
          //마우스가 Down인 경우에만 동작하여 hover 효과를 그려 줍니다
          let x1 = event.clientX - canvasEle.parentElement.offsetLeft || canvasEle.offsetLeft;
          let y1 = event.clientY - canvasEle.parentElement.offsetTop || canvasEle.offsetTop;
          _init(ctx, width, height);
          _drawDataLine(ctx, line, width, height, defaultLineWidth, defaultLineColor, data, lineData);
          ctx.save();
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 4.25;
          ctx.strokeStyle = '#959595';
          ctx.moveTo(startBridge.originX, startBridge.originY);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          ctx.closePath();
          ctx.restore();
        }
      });

      //마우스 다운 이벤트
      canvasEle.addEventListener('mousedown', (event: any) => {
        if (!ctx) return;
        isClicked = true;
        let x1 = event.clientX - canvasEle.parentElement.offsetLeft || canvasEle.offsetLeft;
        let y1 = event.clientY - canvasEle.parentElement.offsetTop || canvasEle.offsetTop;
        if (isClicked) {
          let startTarget: any = _isInSide(x1, y1, width, data); //시작점을 기록 합니다
          startBridge = { ...startTarget, x: startTarget.object.x, y: y1, originX: x1, originY: y1 }; //x축은 그려진 선 기준값을 대입 합니다
        }
      });
      //마우스 업 이벤트
      canvasEle.addEventListener('mouseup', (event: any) => {
        if (!ctx) return;
        hoverPosition = {};
        if (isClicked) {
          //마우스가 다운된 상태의 조건이 충족하면,
          let x1 = event.clientX - canvasEle.parentElement.offsetLeft || canvasEle.offsetLeft;
          let y1 = event.clientY - canvasEle.parentElement.offsetTop || canvasEle.offsetTop;
          let endBridge: any = _isInSide(x1, y1, width, data); //가장 마지막의 선 지점값을 가져 옵니다
          endBridge = { ...endBridge, x: endBridge.object.x, y: y1 }; //x축은 그려진 선 기준값을 대입 합니다

          //같은 선분 또는 옆 영역을 뛰어넘어가는 경우 등록하지 않습니다
          if (startBridge.dataIndex == endBridge.dataIndex || Math.abs(startBridge.dataIndex - endBridge.dataIndex) > 1) {
            isClicked = false;
            hoverPosition = {};
            startBridge = null;
            _init(ctx, width, height);
            _drawDataLine(ctx, line, width, height, defaultLineWidth, defaultLineColor, data, lineData);
            return;
          }

          //첫 마우스 다운 지점에서 마지막 마우스 업 지점까지의 거리를 lineData 배열에 담아둡니다
          let bridgeIdx = _makeid(50);
          startBridge.linkIdx = bridgeIdx;
          endBridge.linkIdx = bridgeIdx;
          data[startBridge.dataIndex].push(startBridge); //데이터 배열에도 넣습니다
          data[endBridge.dataIndex].push(endBridge);
          lineData.push({ startBridge, endBridge });
          _init(ctx, width, height);
          _drawDataLine(ctx, line, width, height, defaultLineWidth, defaultLineColor, data, lineData);
        }
        isClicked = false;
      });

      //마우스 아웃 이벤트
      canvasEle.addEventListener('mouseleave', (event: any) => {
        if (!ctx) return;
        isClicked = false;
        hoverPosition = {};
      });
    }
  }, [option]);

  //초기화 함수 입니다
  function _init(ctx: any, width: number, height: number) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  }
  //맨 처음 선을 그려줍니다
  function _drawLine(ctx: any, line: number, width: number, height: number, defaultLineWidth: number, defaultLineColor: string, data: any) {
    for (let i = 0; i < line; i++) {
      let startPosX = (i / line) * width + ((1 / line) * width) / 2;
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
    _sort(data);
  }
  //y값을 기준으로 내림순으로 정렬 합니다
  function _sort(data: any) {
    data.map((arg: any) => {
      arg.sort((a: any, b: any) => a.y - b.y);
      return arg;
    });
  }
  //그림을 그리는 메인 함수 입니다
  function _drawDataLine(ctx: any, line: number, width: number, height: number, defaultLineWidth: number, defaultLineColor: string, data: any, lineData: any) {
    //기둥 선을 먼저 그리고,
    for (let i = 0; i < line; i++) {
      let startPosX = (i / line) * width + ((1 / line) * width) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = defaultLineWidth;
      ctx.strokeStyle = defaultLineColor;
      ctx.moveTo(startPosX, height * 0.1);
      ctx.lineTo(startPosX, height * 0.9);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

    //사용자가 그린 선분을 그려 줍니다
    lineData.forEach((item: any) => {
      let { startBridge, endBridge } = item;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = defaultLineWidth;
      ctx.strokeStyle = defaultLineColor;
      ctx.moveTo(startBridge.x, startBridge.y);
      ctx.lineTo(endBridge.x, endBridge.y);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    });
    _sort(data);
  }
  //내부 판별 함수 입니다
  function _isInSide(x1: number, y1: number, width: number, data: any) {
    let obj = {};
    let len = width * 3;
    let targetIndex;
    data.forEach((element: any, i: number) => {
      element.forEach((item: any) => {
        let start_x = item.x;
        let start_y = item.y;
        let x = start_x - x1;
        let y = start_y - y1;
        let my_len = Math.sqrt(Math.abs(x * x) + Math.abs(y * y)); //가장 짧은 구간을 찾습니다
        if (my_len < len) {
          len = my_len;
          obj = item;
          targetIndex = i;
        }
      });
    });
    return { object: obj, dataIndex: targetIndex };
  }
  //선분을 연결하기 위한 인덱스를 만드는 함수 입니다
  function _makeid(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  return (
    <div className="body flexCenter hidden">
      <div className={styles.container}>
        <canvas id="canvas" ref={canvas} />
      </div>
    </div>
  );
};

export default WebGhostLegPage;
