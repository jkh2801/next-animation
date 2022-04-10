import { FC, useState } from 'react';
import cn from 'classnames';
import styles from './HomeBox.module.scss';
import { routeNames } from '@utils/const/routeNames';
import Link from 'next/link';
import RoundArrowIcon from '@assets/roundArrowIcon.svg';
import { SetStateType } from '@customTypes/CommonTypes';
import { HomeDesc } from './HomeDesc';

const HomeBox: FC<{ status: string; setStatus: SetStateType<string> }> = ({ status, setStatus }) => {
  console.log('HomeBox');
  const [menuState, setMenuState] = useState(-1);
  const [hoverState, setHoverState] = useState('');
  const handleMenu = (num: number) => {
    setStatus('');
    if (menuState === -1) setMenuState(num);
    else setMenuState(-1);
  };
  return (
    <div className={cn('flex', styles.container, status && styles.active)}>
      <span className={cn(styles.borderWidth, styles.top, status && styles.active)}></span>
      <span className={cn(styles.borderHeight, styles.left, status && styles.active)}></span>
      <span className={cn(styles.borderWidth, styles.bottom, status && styles.active)}></span>
      <span className={cn(styles.borderHeight, styles.right, status && styles.active)}></span>
      <div className={styles.leftMenuBox}>
        <div className="flexColumn">
          <div className={cn('flexCenter gap-1', styles.title)}>
            {'React-Animation'.split('').map((str, idx) => {
              return (
                <span key={idx} className={cn('number fs-20', status && styles['active-' + idx])}>
                  {str}
                </span>
              );
            })}
            <span className={cn(styles.borderWidth, styles.bottom, status && styles.active)}></span>
          </div>
          <div className={styles.scrollBox}>
            {routeNames
              .filter(route => route.type !== 'APP')
              .map((route, idx) => {
                return (
                  <div key={idx}>
                    <div
                      className={cn('flexAlignCenter fs-18', styles.menuBox, menuState === idx || menuState === -1 ? styles.urlAble : styles.urlDisAble, menuState === idx && styles.active)}
                      onClick={() => handleMenu(idx)}
                    >
                      <RoundArrowIcon className={cn(styles.arrowIcon, status && styles.active, status && styles['active-' + idx])} />
                      <span className={cn('flex gap-1', styles.headTitle, status && styles.active, status && styles['active-' + idx])}>{route.name}</span>
                      <span className={cn(styles.borderWidth, styles.bottom, status && styles.active, status && styles['active-' + idx])}></span>
                    </div>
                    {route.data.map((str, i) => {
                      return (
                        <Link key={i} href={route.url[i]}>
                          <a
                            className={cn('flexAlignCenter fs-16', styles.sideBox, menuState === idx ? styles.urlAble : styles.urlDisAble)}
                            style={{ display: route.pagetype[i] === 'APP' ? 'none' : 'flex' }}
                            onMouseEnter={() => setHoverState(route.url[i])}
                          >
                            {str}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className={styles.rightBox}>
        <span className={cn(styles.borderHeight, styles.left, status && styles.active)}></span>
        {hoverState && <HomeDesc descTitle={hoverState} />}
      </div>
    </div>
  );
};

export default HomeBox;
