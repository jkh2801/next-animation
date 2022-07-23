import { HomeButton } from '@components/button';
import { useEffect, useRef } from 'react';
import styles from './Brick.module.scss';
import { Ball, Brick, Paddle } from './web/class';

type RefType = {
  ctx: any;
  width: number;
  height: number;
  arr: Brick[][];
  row: number;
  column: number;
  ball: Ball;
  paddle: Paddle;
  score: number;
  stop: boolean;
};

const WebBrickPage = () => {
  const canvas = useRef(null);
  const ref = useRef<RefType>({
    ctx: null,
    width: 0,
    height: 0,
    arr: [],
    row: 5,
    column: 9,
    ball: new Ball(),
    paddle: new Paddle(),
    score: 0,
    stop: false,
  });

  useEffect(() => {
    const canvasEle: any = canvas.current;
    ref.current.ctx = canvasEle.getContext('2d');
    ref.current.width = canvasEle.width = canvasEle.clientWidth;
    ref.current.height = canvasEle.height = canvasEle.clientHeight;
    let { width, height, arr, row } = ref.current;
    const padding = 10;
    const offsetX = 45;
    const offsetY = 60;
    const w = 70;
    const h = 20;
    const column = ~~((width - offsetX) / (w + padding));
    ref.current.column = column;
    ref.current.ball = new Ball(width / 2, height / 2);
    ref.current.paddle = new Paddle(width / 2 - 60, height - 20);
    for (let y = 0; y < row; y++) {
      arr.push(
        Array(column)
          .fill(1)
          .map((_, x) => new Brick(x * (w + padding) + offsetX, y * (h + padding) + offsetY)),
      );
    }
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    animate();
  }, []);

  const moveBall = () => {
    const { ball, width, height, paddle, arr } = ref.current;
    let x = ball.x + ball.dx;
    let y = ball.y + ball.dy;
    // Wall collision (right/ left)
    if (x + ball.size > width || x - ball.size < 0) {
      ball.setDx(-ball.dx);
    }

    //  Wall collision (top/bottom)
    if (y + ball.size > height || y - ball.size < 0) {
      ball.setDy(-ball.dy);
    }

    // paddle collision
    if (
      x - ball.size > paddle.x && //check left side
      x + ball.size < paddle.x + paddle.w && // check right side
      y + ball.size > paddle.y // running into the paddle
    ) {
      ball.setDy(-ball.speed);
    }
    ball.setX(x);
    ball.setY(y);

    arr.forEach(row =>
      row.forEach(brick => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x && // left brick side check
            ball.x + ball.size < brick.x + brick.w && // right brick side check
            ball.y + ball.size > brick.y && // top brick side check
            ball.y - ball.size < brick.y + brick.h // bottom brick side check)
          ) {
            ball.setDy(-ball.dy);
            brick.setVisible(false);
            ref.current.score++;
          }
        }
      }),
    );
    // Hit bottom wall - Lose
    if (ball.y + ball.size > height) {
      ref.current.stop = true;
    }
  };

  const movePaddle = () => {
    const { paddle, width } = ref.current;
    paddle.setX(paddle.x + paddle.dx);
    if (paddle.x + paddle.w > width) {
      paddle.setX(width - paddle.w);
    }
    if (paddle.x < 0) {
      paddle.setX(0);
    }
  };

  const keyDown = (e: KeyboardEvent) => {
    const { paddle } = ref.current;
    if (e.key === 'Right' || e.key === 'ArrowRight') paddle.setDx(paddle.speed);
    else if (e.key === 'Left' || e.key === 'ArrowLeft') paddle.setDx(-paddle.speed);
    movePaddle();
  };

  const keyUp = (e: KeyboardEvent) => {
    const { paddle } = ref.current;
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
      paddle.setDx(0);
    }
  };

  const animate = () => {
    const fIdx = requestAnimationFrame(animate);
    const { ctx, arr, ball, paddle, score, width, height } = ref.current;
    ctx.clearRect(0, 0, width, height);
    ball.draw(ctx);
    paddle.draw(ctx);
    arr.forEach(row => row.forEach(brick => brick.draw(ctx)));
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, width - 100, 30);
    moveBall();
    if (ref.current.stop) cancelAnimationFrame(fIdx);
  };

  return (
    <div className="body flexCenter hidden" style={{ background: '#65a2ff' }}>
      <HomeButton />
      <div className={styles.container}>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default WebBrickPage;
