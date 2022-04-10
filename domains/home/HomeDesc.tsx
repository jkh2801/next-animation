import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './HomeDesc.module.scss';
import { routeDesc } from '@utils/const/routeDesc';
import Image from 'next/image';
import mask from '@assets/mask.png';
import test from '@assets/thumbnail_balancing.png';

export const HomeDesc: FC<{ descTitle: string }> = ({ descTitle }) => {
  console.log('HomeDesc');
  const [loadStatus, setLoadStatus] = useState(false);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    setLoadStatus(false);
    setTimeout(() => {
      setIsData(routeDesc.hasOwnProperty(descTitle));
      setLoadStatus(true);
    }, 500);
  }, [descTitle]);
  return (
    <div className={cn('total', styles.container)}>
      <div className={cn('flexCenter', styles.tvBox)}>
        <div className={styles.tv}></div>
      </div>
    </div>
  );
  return loadStatus ? (
    isData ? (
      <div className={cn('total', styles.data)}>
        <Image src={test} alt="" />
      </div>
    ) : (
      <div className={cn('total flexCenter flexColumn fs-40', styles.noData)}>
        <div>
          {'No Data'.split('').map((str, idx) => (
            <span key={idx} className={cn('number', styles[`active-${idx}`])}>
              {str}
            </span>
          ))}
        </div>
        <div>
          {' '}
          {'ㅠ.ㅠ'.split('').map((str, idx) => (
            <span key={idx} className={cn(styles[`active-${idx + 8}`])}>
              {str}
            </span>
          ))}
        </div>
      </div>
    )
  ) : (
    <></>
  );
};
