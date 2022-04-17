import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './HomeDesc.module.scss';
import { routeDesc } from '@utils/const/routeDesc';
import Image from 'next/image';

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

  const getTextLength = (idx: number, arr: string[]) => {
    return arr.slice(0, idx).reduce((pre, cur) => pre + cur.trim().length, 0);
  };

  return (
    <div className={cn('total', styles.container)}>
      <div className={cn('flexCenter auto', styles.tvContainer)}>
        <div className={cn('flexCenter', styles.tvBox)}>
          <div className={cn('hidden', styles.tv)}>
            <div className={cn(styles.bg, loadStatus && styles.active)}></div>
            {loadStatus &&
              (isData ? (
                <div>{routeDesc.hasOwnProperty(descTitle) && <Image src={routeDesc[descTitle].thumbnail} alt="" />}</div>
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
              ))}
          </div>
        </div>
      </div>
      <div className={cn('flexCenter', styles.textContainer)}>
        <div className={styles.textBox}>
          {loadStatus &&
            isData &&
            routeDesc.hasOwnProperty(descTitle) &&
            routeDesc[descTitle].desc.split(/\n/g).map((text, idx, arr) => (
              <div key={idx} className={styles.textRow}>
                {text
                  .trim()
                  .split('')
                  .map((str, i) => (
                    <span key={i} className={cn('number fs-16 fw-700', styles.text)} style={{ animationDelay: `${(i + getTextLength(idx, arr)) * 0.05}s` }}>
                      {str}
                    </span>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
