import balancing from '@assets/thumbnail_balancing.png';
import markdown from '@assets/thumbnail_markdown.png';
import receipt from '@assets/thumbnail_receipt.png';
import draggable from '@assets/thumbnail_draggable.png';
import digital from '@assets/thumbnail_digital.gif';
import particle from '@assets/thumbnail_particle.gif';
import loadingEx1 from '@assets/thumbnail_loadingEx1.gif';
import { RouteDescType } from '@customTypes/HomeTypes';

export const routeDesc: RouteDescType = {
  balancing: {
    thumbnail: balancing,
    desc: `Balancing Page
    This is a simple design page. I just wanted to express the scale of both arms according to the weight. 
    Please enter a number on the scale. You can enter only natural numbers on a scale. You'll be able to see the dynamic changes with the number of inputs.`,
  },
  digital: {
    thumbnail: digital,
    desc: `Digital Page
    This is an animation page using canvas tags. You can check the repetition of the animation in the canvas. You can refer to the canvas process in the react component.`,
  },
  draggable: {
    thumbnail: draggable,
    desc: `Draggable Page
    This is a simple draggable page. It is designed for the purpose of testing the react-draggable library.
    Please drag the contents in the box. You will be able to check the smooth drag movement.`,
  },
  loadingex1: {
    thumbnail: loadingEx1,
    desc: `Loading Page
    This is an animation page using canvas tags. You can check the repetition of the animation in the canvas. You can refer to the canvas process in the react component.`,
  },

  markdown: {
    thumbnail: markdown,
    desc: `Markdown Page
    This is a markdown preview page. It is designed for the purpose of testing the react-markdown library.`,
  },
  particle: {
    thumbnail: particle,
    desc: `Particle Page
    This is an animation page using canvas tags. You can check the repetition of the animation in the canvas. You can refer to the canvas process in the react component.`,
  },
  receipt: {
    thumbnail: receipt,
    desc: `Receipt Page
    This is a simple design page. It is designed for the purpose of testing the HTML-to-image library. 
    Write your own receipt through a simple UI. And experience the download function.`,
  },
};
