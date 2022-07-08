import { HomeButton } from '@components/button';
import cn from 'classnames';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import styles from './Draggable.module.scss';

export const WebDraggablePage = () => {
  const [list, setList] = useState([
    { idx: 0, x: 0, y: 0, text: 'test 1', active: false },
    { idx: 1, x: 0, y: 50, text: 'test 2', active: false },
    { idx: 2, x: 0, y: 100, text: 'test 3', active: false },
    { idx: 3, x: 0, y: 150, text: 'test 4', active: false },
    { idx: 4, x: 0, y: 200, text: 'test 5', active: false },
    { idx: 5, x: 0, y: 250, text: 'test 6', active: false },
    { idx: 6, x: 0, y: 300, text: 'test 7', active: false },
    { idx: 7, x: 0, y: 350, text: 'test 8', active: false },
    { idx: 8, x: 0, y: 400, text: 'test 9', active: false },
  ]);
  const activeItem = useRef({
    idx: 0,
    y: 0,
  });

  const handleDragStart = (idx: number) => {
    list[idx].active = true;
    activeItem.current.idx = idx;
    activeItem.current.y = list[idx].y;
    setList([...list]);
  };

  const handleDragEvent = (e: any, position: any, idx: number) => {
    const { y } = position;
    const filteredList = list.filter(e => e.idx !== idx);
    const defaultY: number = activeItem.current.y;
    const index: number = defaultY / 50;
    if (y >= defaultY + 25) {
      if (index !== list.length - 1) {
        const nextItem = filteredList.find(e => e.y === defaultY + 50);
        if (nextItem) {
          nextItem.y = defaultY;
          activeItem.current.y = defaultY + 50;
        }
      }
    } else if (y <= defaultY - 25) {
      if (index !== 0) {
        const preItem = filteredList.find(e => e.y === defaultY - 50);
        if (preItem) {
          preItem.y = defaultY;
          activeItem.current.y = defaultY - 50;
        }
      }
    }
    setList([...list]);
  };
  const handleDropEvent = (e: any, position: any, idx: number) => {
    list[idx].active = false;
    list[idx].y = activeItem.current.y;
    setList([...list]);
  };
  return (
    <div className="body flexCenter hidden" style={{ background: '#a4ff424d' }}>
      <HomeButton />
      <div className={styles.container}>
        {list.map((e, idx) => {
          return (
            <Draggable
              axis="y"
              key={idx}
              onStart={() => handleDragStart(idx)}
              onDrag={(e, position) => handleDragEvent(e, position, idx)}
              onStop={(e, position) => handleDropEvent(e, position, idx)}
              position={{ x: e.x, y: e.y }}
              bounds="parent"
            >
              <div className={cn('flexCenter', styles.content, e.active && styles.active)}>{e.text}</div>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};
