import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './HomeDesc.module.scss';
import { routeDesc } from '@utils/const/routeDesc';

export const HomeDesc: FC<{ descTitle: string }> = ({ descTitle }) => {
  const [loadStatus, setLoadStatus] = useState(false);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    setLoadStatus(false);
    setTimeout(() => {
      setIsData(routeDesc.hasOwnProperty(descTitle));
      setLoadStatus(true);
    }, 500);
  }, [descTitle]);
  return loadStatus ? (
    isData ? (
      <div></div>
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
