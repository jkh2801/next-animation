import styles from './MovingStar.module.scss';
import { useEffect, useRef } from 'react';
import { HomeButton } from '@components/button';

export const WebMovingStarPage = () => {
  const canvas = useRef(null);
  let ctx: any;
  let width: number;
  let height: number;
  let boids: any = [];
  let center: any;
  let center2: any;
  let center3: any;
  let center4: any;
  let center5: any;
  useEffect(() => {
    const canvasEle: any = canvas.current;
    ctx = canvasEle.getContext('2d');
    width = canvasEle.width = canvasEle.clientWidth;
    height = canvasEle.height = canvasEle.clientHeight;
    center = { x: Math.random() * width, y: Math.random() * height };
    center2 = { x: Math.random() * width, y: Math.random() * height };
    center3 = { x: Math.random() * width, y: Math.random() * height };
    center4 = { x: Math.random() * width, y: Math.random() * height };
    center5 = { x: Math.random() * width, y: Math.random() * height };
    setting();
    animate();
  }, []);
  class Vector {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    mag = () => {
      return dis(0, 0, this.x, this.y);
    };
    dir = () => {
      if (this.mag() !== 0) {
        return Math.atan2(this.y, this.x);
      }
    };
    add = (v: Vector) => {
      this.x += v.x;
      this.y += v.y;
    };
    sub = (v: Vector) => {
      this.x -= v.x;
      this.y -= v.y;
    };
    mult = (n: number) => {
      this.x *= n;
      this.y *= n;
    };
    div = (n: number) => {
      this.x /= n;
      this.y /= n;
    };
    makeMag = (m: number) => {
      if (this.mag() !== 0) {
        this.div(this.mag());
        this.mult(m);
      } else {
        return;
      }
    };
    limit = (l: number) => {
      if (this.mag() > l) {
        this.makeMag(l);
      } else {
        return;
      }
    };
    connect = (v: Vector) => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(v.x, v.y);
      ctx.stroke();
    };
    get = () => {
      return new Vector(this.x, this.y);
    };
  }
  var PVector = {
    add: function (v1: Vector, v2: Vector) {
      return new Vector(v1.x + v2.x, v1.y + v2.y);
    },
    sub: function (v1: Vector, v2: Vector) {
      return new Vector(v1.x - v2.x, v1.y - v2.y);
    },
    rand: function () {
      var ran = randFrom(0, 2 * Math.PI, 'exact');
      return new Vector(Math.cos(ran), Math.sin(ran));
    },
  };
  class Vehicle {
    pos: Vector;
    r: number;
    c: string;
    vel: Vector;
    acc: Vector;
    l: number;
    constructor(x = 0, y = 0, r: number, c: string) {
      this.pos = new Vector(x, y);
      this.r = r;
      this.c = c;
      this.vel = new Vector();
      this.acc = new Vector();
      this.l = randFrom(3, 25);
    }

    applyForce = (force: Vector) => {
      var f = force.get();
      this.acc.add(f);
    };
    upd = () => {
      ctx.strokeStyle = this.c;
      var f1 = PVector.sub(this.pos, center);
      var rotf1 = new Vector(-f1.y, f1.x);
      rotf1.makeMag(150 / dis(this.pos.x, this.pos.y, center.x, center.y));
      if (dis(this.pos.x, this.pos.y, center.x, center.y) !== 0) {
        this.applyForce(rotf1);
      }
      var f2 = PVector.sub(this.pos, center2);
      var rotf2 = new Vector(f2.y, -f2.x);
      rotf2.makeMag(150 / dis(this.pos.x, this.pos.y, center2.x, center2.y));
      if (dis(this.pos.x, this.pos.y, center2.x, center2.y) !== 0) {
        this.applyForce(rotf2);
      }
      var f3 = PVector.sub(this.pos, center3);
      var rotf3 = new Vector(-f3.y, f3.x);
      rotf3.makeMag(150 / dis(this.pos.x, this.pos.y, center3.x, center3.y));
      if (dis(this.pos.x, this.pos.y, center3.x, center3.y) !== 0) {
        this.applyForce(rotf3);
      }
      var f4 = PVector.sub(this.pos, center4);
      var rotf4 = new Vector(f4.y, -f4.x);
      rotf4.makeMag(150 / dis(this.pos.x, this.pos.y, center4.x, center4.y));
      if (dis(this.pos.x, this.pos.y, center4.x, center4.y) !== 0) {
        this.applyForce(rotf4);
      }
      var f5 = PVector.sub(this.pos, center5);
      var rotf5 = new Vector(f5.y, -f5.x);
      rotf5.makeMag(150 / dis(this.pos.x, this.pos.y, center5.x, center5.y));
      if (dis(this.pos.x, this.pos.y, center5.x, center5.y) !== 0) {
        this.applyForce(rotf5);
      }
      this.vel.add(this.acc);
      this.vel.limit(1);
      ctx.lineWidth = this.r;
      //ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      this.pos.add(this.vel);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.stroke();
      this.l -= 0.5;
      if (this.l <= 0) {
        this.vel = new Vector(0, 0);
        this.pos.x = randFrom(0, width);
        this.pos.y = randFrom(0, height);
        this.l = randFrom(3, 35);
      }
      this.acc.mult(0);
    };
  }
  const dis = (x: number, y: number, x2: number, y2: number) => {
    var xl = x2 - x;
    var yl = y2 - y;
    return Math.sqrt(xl ** 2 + yl ** 2);
  };
  const map = (val: number, min: number, max: number, min2: number, max2: number) => {
    var diff1 = max - min;
    var diff2 = max2 - min2;
    return (diff2 / diff1) * val;
  };
  const randFrom = (min: number, max: number, t: string = '') => {
    if (t == 'exact') {
      return Math.random() * (max - min) + min;
    } else {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };

  const setting = () => {
    const rad = 1;
    const cols = ['cyan', 'orange', 'yellow'];
    for (var i = 0; i < 1200; i++) {
      var x = randFrom(rad, width - rad, 'exact');
      var y = randFrom(rad, height - rad, 'exact');
      boids.push(new Vehicle(x, y, rad, cols[Math.floor(Math.random() * cols.length)]));
    }
  };
  const animate = () => {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(33,0,53,0.06)';
    ctx.fillRect(0, 0, width, height);
    boids.forEach((boid: any) => {
      boid.upd();
    });
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
