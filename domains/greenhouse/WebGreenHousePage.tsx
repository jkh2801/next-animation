import { HomeButton } from '@components/button';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import styles from './GreenHouse.module.scss';
import { Cell } from './web/class';
import { farm, map } from './web/data';

type RefType = {
  ctx: any;
  cells: Cell[][];
  unitLength: number;
  camera: {
    x: number;
    y: number;
  };
  mouseDown: {
    x: number;
    y: number;
  };
  mouseMove: {
    x: number;
    y: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  canvas: {
    width: number;
    height: number;
  };
  mouseState: string;
  selectDatas: string[];
};

const WebGreenHousePage = () => {
  const canvas = useRef(null);
  const ref = useRef<RefType>({
    ctx: null,
    cells: [],
    unitLength: 30,
    camera: {
      x: 0,
      y: 0,
    },
    mouseDown: {
      x: 0,
      y: 0,
    },
    mouseMove: {
      x: 0,
      y: 0,
    },
    viewport: {
      width: 0,
      height: 0,
    },
    canvas: {
      width: 0,
      height: 0,
    },
    mouseState: '',
    selectDatas: [],
  });
  console.log(farm);
  console.log(map);

  useEffect(() => {
    const canvasEle: any = canvas.current;
    ref.current.ctx = canvasEle.getContext('2d');
    ref.current.viewport.width = canvasEle.width = canvasEle.clientWidth;
    ref.current.viewport.height = canvasEle.height = canvasEle.clientHeight;

    init();
  }, []);

  useEffect(() => {
    const canvasEle: any = canvas.current;
    if (!canvasEle) return;
    canvasEle.addEventListener('mousedown', handleMouseDownEvent);
    canvasEle.addEventListener('mousemove', handleMouseMoveEvent);
    canvasEle.addEventListener('mouseup', handleMouseUpEvent);
    canvasEle.addEventListener('wheel', handleWheelEvent, { passion: false });
    return () => {
      canvasEle.removeEventListener('mousedown', handleMouseDownEvent);
      canvasEle.removeEventListener('mousemove', handleMouseMoveEvent);
      canvasEle.removeEventListener('mouseup', handleMouseUpEvent);
      canvasEle.removeEventListener('wheel', handleWheelEvent);
    };
  }, [ref.current.mouseState]);

  const handleMouseUpEvent = () => {
    ref.current.mouseState = '';
  };

  const handleMouseDownEvent = (e: MouseEvent) => {
    const { button } = e;
    const { camera } = ref.current;
    if (button === 0) {
      if (!e.ctrlKey) ref.current.selectDatas = [];
      ref.current.mouseDown = {
        x: e.pageX + camera.x,
        y: e.pageY + camera.y,
      };
      ref.current.mouseMove = {
        x: e.pageX + camera.x,
        y: e.pageY + camera.y,
      };
      ref.current.mouseState = 'drag';
    } else if (button === 1) {
      ref.current.mouseDown = {
        x: e.pageX,
        y: e.pageY,
      };
      ref.current.mouseState = 'translate';
    } else if (button === 2) {
    }
  };

  const handleMouseMoveEvent = (e: MouseEvent) => {
    const { mouseState, camera, mouseDown, unitLength, selectDatas } = ref.current;
    if (mouseState === 'translate') {
      moveCamera(e.pageX - mouseDown.x, e.pageY - mouseDown.y);
      ref.current.mouseDown = {
        x: e.pageX,
        y: e.pageY,
      };
    } else if (mouseState === 'drag') {
      const x1 = ~~(mouseDown.x / unitLength);
      const x2 = ~~((camera.x + e.pageX) / unitLength);
      const y1 = ~~(mouseDown.y / unitLength);
      const y2 = ~~((camera.y + e.pageY) / unitLength);
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          if (0 <= x && x < map.width && 0 <= y && y < map.height) {
            const str = `${x}-${y}`;
            if (!~selectDatas.indexOf(str)) selectDatas.push(str);
          }
        }
      }
      console.log(selectDatas);
    }
    ref.current.mouseMove = {
      x: e.pageX + camera.x,
      y: e.pageY + camera.y,
    };
  };

  const init = () => {
    const { unitLength, ctx } = ref.current;
    ref.current.canvas = {
      width: map.width * unitLength,
      height: map.height * unitLength,
    };
    ref.current.camera = {
      x: (ref.current.canvas.width - ref.current.viewport.width) / 2,
      y: (ref.current.canvas.height - ref.current.viewport.height) / 2,
    };
    map.cellMatrix.forEach((arr, y) => {
      ref.current.cells.push(
        arr.map((str, x) => {
          if (str === '0') return new Cell(x, y);
          else {
            const info = str.split('/');
            if (info[0] === '0' || info[0] === '1') return new Cell(x, y, 'header', info[1]);
            return new Cell(x, y, 'cell');
          }
        }),
      );
    });
    ctx.translate(-ref.current.camera.x, -ref.current.camera.y);
    animate();
  };

  const animate = () => {
    const { ctx, cells, viewport, camera, unitLength, mouseMove, mouseState, selectDatas } = ref.current;
    requestAnimationFrame(animate);
    ctx.clearRect(camera.x, camera.y, viewport.width, viewport.height);
    const x1 = ~~(camera.x / unitLength);
    const x2 = ~~((camera.x + viewport.width) / unitLength);
    const y1 = ~~(camera.y / unitLength);
    const y2 = ~~((camera.y + viewport.height) / unitLength);
    const mx = ~~(mouseMove.x / unitLength);
    const my = ~~(mouseMove.y / unitLength);
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (0 <= x && x < map.width && 0 <= y && y < map.height) {
          if (~selectDatas.indexOf(`${x}-${y}`)) cells[y][x].draw(ctx, unitLength, 'selected');
          else if (mx === x && my === y) cells[y][x].draw(ctx, unitLength, 'mouseover');
          else cells[y][x].draw(ctx, unitLength);
        }
      }
    }
    if (mouseState === 'drag') setDragArea();
  };

  const setDragArea = () => {
    const { ctx, mouseDown, mouseMove } = ref.current;
    ctx.beginPath();
    ctx.strokeStyle = '#9a54f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(mouseDown.x, mouseDown.y, mouseMove.x - mouseDown.x, mouseMove.y - mouseDown.y);
  };

  const moveCamera = (x: number, y: number) => {
    const { ctx } = ref.current;
    ref.current.camera.x += -x;
    ref.current.camera.y += -y;
    ctx.translate(x, y);
  };

  const handleWheelEvent = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { unitLength } = ref.current;
    if (e.deltaY < 0 && unitLength < 30) ref.current.unitLength++;
    if (e.deltaY > 0 && unitLength > 20) ref.current.unitLength--;
  };

  return (
    <div className="body flexCenter hidden">
      <HomeButton />
      <div className={styles.container}>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default WebGreenHousePage;
