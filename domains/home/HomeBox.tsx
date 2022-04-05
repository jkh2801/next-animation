import { FC, useState } from 'react';
import cn from 'classnames';
import styles from './HomeBox.module.scss';
import { routeNames } from '@utils/const/routeNames';
import Link from 'next/link';
import RoundArrowIcon from '@assets/roundArrowIcon.svg';

const HomeBox: FC<{ status: string }> = ({ status }) => {
  console.log(status);
  const [menuState, setMenuState] = useState(-1);
  const handleMenu = (num: number) => {
    if (menuState === -1) setMenuState(num);
    else setMenuState(-1);
  };
  return (
    <div className={cn('flex', styles.container)}>
      <div className={styles.leftMenuBox}>
        <div className="flexColumn">
          <div className={cn('flexCenter number fs-20', styles.title)}>React-Animation</div>
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
                      <RoundArrowIcon className={styles.arrowIcon} />
                      {route.name}
                    </div>
                    {route.data.map((str, i) => {
                      return (
                        <Link key={i} href={route.url[i]}>
                          <a
                            className={cn('flexAlignCenter fs-16', styles.sideBox, menuState === idx ? styles.urlAble : styles.urlDisAble)}
                            style={{ display: route.pagetype[i] === 'APP' ? 'none' : 'flex' }}
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
      <div className={styles.rightBox}></div>
    </div>
  );
};

export default HomeBox;
