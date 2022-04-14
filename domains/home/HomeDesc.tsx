import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './HomeDesc.module.scss';
import { routeDesc } from '@utils/const/routeDesc';
import Image from 'next/image';
import mask from '@assets/mask.png';
import test from '@assets/thumbnail_balancing.png';
import Markdown from 'markdown-to-jsx';

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
      <div className={cn('flexCenter', styles.tvContainer)}>
        <div className={cn('flexCenter', styles.tvBox)}>
          <div className={cn('hidden', styles.tv)}>
            <div className={cn(styles.bg, loadStatus && styles.active)}></div>
            {loadStatus ? (
              isData ? (
                <div className={cn('', styles.data)}>{routeDesc.hasOwnProperty(descTitle) && <Image src={routeDesc[descTitle].thumbnail} alt="" />}</div>
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
            )}
          </div>
        </div>
      </div>
      <div>
        {' '}
        {`asdfsadf
      asdfasdf
      asdf`.replace(/\n/g, '<br/>')}
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
