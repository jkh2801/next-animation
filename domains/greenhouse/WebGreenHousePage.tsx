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
  mouse: {
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
    mouse: {
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
          if (str === '0') return new Cell(x * unitLength, y * unitLength);
          else {
            const info = str.split('/');
            if (info[0] === '0' || info[0] === '1') return new Cell(x * unitLength, y * unitLength, 'header', info[1]);
            return new Cell(x * unitLength, y * unitLength, 'cell');
          }
        }),
      );
    });
    ctx.translate(-ref.current.camera.x, -ref.current.camera.y);
    console.log(ref.current);
    animate();
  };

  const animate = () => {
    const { ctx, cells, viewport, camera, unitLength } = ref.current;
    requestAnimationFrame(animate);
    ctx.clearRect(camera.x, camera.y, viewport.width, viewport.height);
    const x1 = ~~(camera.x / unitLength);
    const x2 = ~~((camera.x + viewport.width) / unitLength);
    const y1 = ~~(camera.y / unitLength);
    const y2 = ~~((camera.y + viewport.height) / unitLength);
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (0 <= x && x < map.width && 0 <= y && y < map.height) cells[y][x].draw(ctx);
      }
    }
  };

  const handleMouseDownEvent = (e: React.MouseEvent) => {
    const canvasEle: any = canvas.current;
    ref.current.mouse = {
      x: e.pageX,
      y: e.pageY,
    };
    canvasEle.addEventListener('mousemove', handleMouseMoveEvent);
    canvasEle.addEventListener('mouseup', handleMouseUpEvent);
  };

  const handleMouseUpEvent = (e: React.MouseEvent) => {
    const canvasEle: any = canvas.current;
    canvasEle.removeEventListener('mousemove', handleMouseMoveEvent);
    canvasEle.removeEventListener('mouseup', handleMouseUpEvent);
  };

  const handleMouseMoveEvent = (e: React.MouseEvent) => {
    const { x, y } = ref.current.mouse;
    moveCamera(e.pageX - x, e.pageY - y);
    ref.current.mouse = {
      x: e.pageX,
      y: e.pageY,
    };
  };

  const moveCamera = (x: number, y: number) => {
    const { ctx } = ref.current;
    ref.current.camera.x += -x;
    ref.current.camera.y += -y;
    ctx.translate(x, y);
  };

  const handleWheelEvent = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    console.log(e.deltaY);
    const { ctx } = ref.current;
  };

  return (
    <div className="body flexCenter hidden">
      <HomeButton />
      <div className={styles.container}>
        <canvas ref={canvas} onMouseDown={handleMouseDownEvent} onWheel={handleWheelEvent} />
      </div>
    </div>
  );
};

export default WebGreenHousePage;
