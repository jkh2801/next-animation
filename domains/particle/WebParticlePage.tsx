import { HomeButton } from '@components/button';
import { useEffect, useRef } from 'react';
import styles from './Particle.module.scss';

export const WebParticlePage = () => {
  const canvas = useRef(null);
  const opts = {
    particleColor: 'rgb(200,200,200)',
    lineColor: 'rgb(200,200,200)',
    particleAmount: 50,
    defaultSpeed: 1,
    variantSpeed: 1,
    defaultRadius: 2,
    variantRadius: 2,
    linkRadius: 200,
  };
  let ctx: any;
  let width: number;
  let height: number;
  let rgb: any = opts.lineColor.match(/\d+/g);
  const particles: any = [];
  useEffect(() => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    width = canvasEle.width = canvasEle.clientWidth;
    height = canvasEle.height = canvasEle.clientHeight;
    Array(opts.particleAmount)
      .fill(1)
      .forEach(() => {
        const directionAngle = Math.floor(Math.random() * 360);
        const speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: speed,
          directionAngle: directionAngle,
          color: opts.particleColor,
          radius: opts.defaultRadius + Math.random() * opts.variantRadius,
          vector: {
            x: Math.cos(directionAngle) + speed,
            y: Math.sin(directionAngle) + speed,
          },
        });
      });
    animate();
  }, []);

  const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      update(particle);
      draw(particle);
    }
    linkPoints();
  };

  const update = (particle: any) => {
    if (particle.x >= width || particle.x <= 0) {
      particle.vector.x *= -1;
    }
    if (particle.y >= height || particle.y <= 0) {
      particle.vector.y *= -1;
    }
    if (particle.x > width) particle.x = width;
    if (particle.y > height) particle.y = height;
    if (particle.x < 0) particle.x = 0;
    if (particle.y < 0) particle.y = 0;
    particle.x += particle.vector.x;
    particle.y += particle.vector.y;
  };

  const draw = (particle: any) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = particle.color;
    ctx.fill();
  };

  const linkPoints = () => {
    for (const point1 of particles) {
      for (const point2 of particles) {
        let distance = checkDistance(point1.x, point1.y, point2.x, point2.y);
        let opacity = 1 - distance / opts.linkRadius;
        if (opacity > 0) {
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(point1.x, point1.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  };

  const checkDistance = function (x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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
