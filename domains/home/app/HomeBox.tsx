import { FC, useState } from 'react';
import cn from 'classnames';
import styles from './HomeBox.module.scss';
import { routeNames } from '@utils/const/routeNames';
import Link from 'next/link';
import RoundArrowIcon from '@assets/roundArrowIcon.svg';

const AppHomeBox: FC = () => {
  const [menuState, setMenuState] = useState(-1);
  const handleMenu = (num: number) => {
    if (menuState === -1) setMenuState(num);
    else setMenuState(-1);
  };
  return (
    <div className={cn('flex', styles.container)}>
      <div className={styles.leftMenuBox}>
        <div className="flexColumn">
          <div className={cn('flexCenter gap-1', styles.title)}>
            {'React-Animation'.split('').map((str, idx) => {
              return (
                <span key={idx} className={cn('number fs-20', styles['active-' + idx])}>
                  {str}
                </span>
              );
            })}
            <span className={cn(styles.borderWidth, styles.bottom)}></span>
          </div>
          <div className={styles.scrollBox}>
            {routeNames
              .filter(route => route.type !== 'WEB')
              .map((route, idx) => {
                return (
                  <div key={idx}>
                    <div
                      className={cn('flexAlignCenter fs-18', styles.menuBox, menuState === idx || menuState === -1 ? styles.urlAble : styles.urlDisAble, menuState === idx && styles.active)}
                      onClick={() => handleMenu(idx)}
                    >
                      <RoundArrowIcon className={cn(styles.arrowIcon, styles['active-' + idx])} />
                      <span className={cn('flex gap-1 number', styles.headTitle, styles['active-' + idx])}>{route.name}</span>
                      <span className={cn(styles.borderWidth, styles.bottom, styles['active-' + idx])}></span>
                    </div>
                    {route.data.map((str, i) => {
                      return (
                        <Link key={i} href={route.url[i]}>
                          <a
                            className={cn('flexAlignCenter fs-16 number', styles.sideBox, menuState === idx ? styles.urlAble : styles.urlDisAble)}
                            style={{ display: route.pagetype[i] === 'WEB' ? 'none' : 'flex' }}
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
    </div>
  );
};

export default AppHomeBox;
