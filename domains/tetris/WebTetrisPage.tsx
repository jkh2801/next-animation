import styles from './Testris.module.scss';
import cn from 'classnames';
import { HomeButton } from '@components/button';
import { useEffect, useRef, useState } from 'react';
import CrownIcon from '@assets/crownIcon.svg';

export const WebTestrisPage = () => {
  const canvas = useRef(null);
  let width: number;
  let height: number;
  const [setting, setSetting] = useState({
    score: 0,
  });
  let ctx: any;
  const colors = [null, '#FF0000', '#FF00C7', '#43FFDA', '#00D1FF', '#B500FF', '#FFF500', '#FFB800'];
  let status = true;
  const createPiece = () => {
    const pieces = 'ILJOTSZ';
    const type = pieces[~~(Math.random() * pieces.length)];
    switch (type) {
      case 'I':
        return [
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0],
        ];
      case 'L':
        return [
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 3],
        ];
      case 'J':
        return [
          [0, 4, 0],
          [0, 4, 0],
          [4, 4, 0],
        ];
      case 'O':
        return [
          [2, 2],
          [2, 2],
        ];
      case 'T':
        return [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ];
      case 'S':
        return [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0],
        ];
      case 'Z':
        return [
          [7, 7, 0],
          [0, 7, 7],
          [0, 0, 0],
        ];
    }
    return [[]];
  };
  const createMatrix = (w: number, h: number) => {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  };
  const player = {
    pos: { x: 5, y: -1 },
    matrix: createPiece(),
  };
  const arena = createMatrix(12, 20);
  let dropCounter = 0;
  let dropInterval = 1000;
  let lastTime = 0;
  useEffect(() => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    width = canvasEle.width = canvasEle.clientWidth;
    height = canvasEle.height = canvasEle.clientHeight;
    ctx.scale(20, 20);

    animate();
    document.addEventListener('keydown', handleKeyPress);
  }, []);

  const animate = (time = 0) => {
    if (status) {
      requestAnimationFrame(animate);
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
        playerDrop();
      }
      draw();
    }
  };

  const playerDrop = () => {
    player.pos.y++;
    if (collide(arena, player)) {
      player.pos.y--;
      merg(arena, player);
      playerReset();
      arenaSwipe();
    }
    dropCounter = 0;
  };

  const collide = (arena: any, player: any) => {
    const [m, p] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x] != 0 && (arena[y + p.y] && arena[y + p.y][x + p.x]) != false) {
          return true;
        }
      }
    }
    return false;
  };

  const merg = (arena: any, player: any) => {
    player.matrix.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  };

  const playerReset = () => {
    player.matrix = createPiece();
    player.pos.y = 0;
    player.pos.x = 5;
    if (collide(arena, player)) {
      status = false;
      // arena.forEach(row => row.fill(0));
      // setting.score = 0;
      // setSetting({ ...setting });
    }
  };

  const arenaSwipe = () => {
    arena.forEach((ele, i) => {
      if (ele.every(el => el > 0)) {
        arena.splice(i, 1);
        arena.unshift(new Array(ele.length).fill(0));
        setting.score++;
        if (dropInterval > 100) dropInterval -= 100;
      }
    });
    setSetting({ ...setting });
  };

  const draw = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
  };

  const drawMatrix = (matrix: number[][], offset: any) => {
    matrix.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value) {
          ctx.fillStyle = colors[value];
          ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode == 37) playerMove(-1);
    if (e.keyCode == 39) playerMove(1);
    if (e.keyCode == 40) playerDrop();
    if (e.keyCode == 87) playerRotate(-1);
    if (e.keyCode == 81 || e.keyCode == 38) playerRotate(1);
  };

  const playerMove = (dir: number) => {
    player.pos.x += dir;
    if (collide(arena, player)) {
      player.pos.x -= dir;
    }
  };

  const playerRotate = (dir: number) => {
    const pos = player.pos.x;
    let offset = 1;
    rotateMatrix(player.matrix, dir);
    while (collide(arena, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.matrix[0].length) {
        rotateMatrix(player.matrix, -dir);
        player.pos.x = pos;
        return;
      }
    }
  };

  const rotateMatrix = (matrix: number[][], dir: number) => {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  };
  return (
    <div className="body flexCenter hidden" style={{ background: '#2b98ff' }}>
      <HomeButton />
      <div className={cn('flex gap-10', styles.container)}>
        <canvas width="240" height="400" ref={canvas} />
        <div className="flexColumn flexBetweenCenter">
          <div className={cn('flexCenter flexColumn gap-5', styles.lineBox)}>
            <div className="number fs-30">{setting.score}</div>
            <div className="number fs-20">Lines</div>
          </div>
          <div className={cn('flexCenter', styles.iconBox)}>{setting.score >= 15 && <CrownIcon />}</div>
        </div>
      </div>
    </div>
  );
};
