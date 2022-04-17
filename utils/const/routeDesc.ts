import balancing from '@assets/thumbnail_balancing.png';
import markdown from '@assets/thumbnail_markdown.png';
import { RouteDescType } from '@customTypes/HomeTypes';

export const routeDesc: RouteDescType = {
  balancing: {
    thumbnail: balancing,
    desc: `Balancing Page
    This is a simple design page. I just wanted to express the scale of both arms according to the weight. 
    Please enter a number on the scale. You can enter only natural numbers on a scale. You'll be able to see the dynamic changes with the number of inputs.`,
  },
  markdown: {
    thumbnail: markdown,
    desc: `Markdown Page
    This is a markdown preview page. It is designed for the purpose of testing the react-markdown library.`,
  },
};
