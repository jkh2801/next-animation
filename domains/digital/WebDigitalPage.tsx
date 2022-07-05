import { HomeButton } from '@components/button';
import { useEffect, useRef } from 'react';
import styles from './Digital.module.scss';

const WebDigitalPage = () => {
  const canvas = useRef(null);
  let ctx: any;
  let width: number;
  let height: number;
  let fontSize = 20;
  let columns: number;
  const array: any = [];
  useEffect(() => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    width = canvasEle.width = canvasEle.clientWidth;
    height = canvasEle.height = canvasEle.clientHeight;
    setArray();
    animate();
  }, []);

  const setArray = () => {
    columns = Math.ceil(width / fontSize);
    Array(columns)
      .fill(0)
      .map(() => array.push({ y: 0 }));
  };
  const animate = () => {
    requestAnimationFrame(animate);
    ctx.fillStyle = '#0000001a';
    ctx.fillRect(0, 0, width, height);
    Array(columns)
      .fill(0)
      .map((_, i) => drawItem(i));
  };

  const drawItem = (x: number) => {
    const item = array[x];
    const characters = '01';
    ctx.fillStyle = 'green';
    ctx.font = fontSize + 'px arial';
    var symbol = characters.charAt(~~(Math.random() * characters.length));
    ctx.fillText(symbol, x * fontSize, item.y * fontSize);
    if (item.y * fontSize > height && Math.random() > 0.95) {
      item.y = 0;
    } else {
      item.y++;
    }
  };
  return (
    <div className="body flexCenter hidden">
      <HomeButton />
      <div className={styles.container}>
        <canvas id="canvas" ref={canvas} />
      </div>
    </div>
  );
};

export default WebDigitalPage;
