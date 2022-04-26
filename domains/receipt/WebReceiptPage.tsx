import { HomeButton } from '@components/button';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './Receipt.module.scss';

const WebReceiptPage = () => {
  console.log('WebReceiptPage');

  const [isDownload, setIsDownload] = useState(true);
  const [info, setInfo] = useState({
    name: 'Shop Name or Shop Address',
    date: dayjs(),
    manager: 'Representative Name',
  });

  const handleSetInfo = (key: string, value: any) => {
    switch (key) {
      case 'name':
        setInfo({ ...info, name: value.trim() });
        break;
      case 'date':
        setInfo({ ...info, date: value });
        break;
      case 'manager':
        setInfo({ ...info, manager: value.trim() });
        break;
    }
  };

  return (
    <div className="body flexCenter" style={{ background: '#7bffa3' }}>
      <HomeButton />
      <div className={styles.container}>
        <p className={cn('fs-30 fw-700 number', styles.title)}>Receipt</p>
        <div className={cn('flexColumn gap-5', styles.headerForm)}>
          <div className="flexBetweenCenter">
            <span className="number">Shop Name</span>
            {isDownload ? (
              <span className="number">{info.name}</span>
            ) : (
              <input type="text" className={cn('number', styles.input)} value={info.name} onChange={e => handleSetInfo('name', e.target.value)} />
            )}
          </div>
          <div className="flexBetweenCenter">
            <span className="number">Date</span>
            {isDownload ? <span className="number">{info.date.clone().format('YYYY.MM.DD')}</span> : <div></div>}
          </div>
          <div className="flexBetweenCenter">
            <span className="number">Manager</span>
            {isDownload ? (
              <span className="number">{info.manager}</span>
            ) : (
              <input type="text" className={cn('number', styles.input)} value={info.manager} onChange={e => handleSetInfo('manager', e.target.value)} />
            )}
          </div>
        </div>
        <p className={cn('fs-20 fw-500 number', styles.subTitle)}>Description</p>
        <div className={cn(styles.descBox)}></div>
        <div className={cn('flexBetweenCenter', styles.totalBox)}>
          <span className="fs-20 fw-500 number">Total</span>
        </div>
      </div>
    </div>
  );
};

export default WebReceiptPage;
