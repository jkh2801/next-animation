import { StaticImageData } from 'next/image';

export type RouteType = {
  type: string;
  name: string;
  data: string[];
  url: string[];
  pagetype: string[];
};

export type RouteDescType = {
  [key: string]: {
    thumbnail: StaticImageData;
    desc: string;
  };
};
