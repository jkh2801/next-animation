import { HomeButton } from '@components/button';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './Receipt.module.scss';

const WebReceiptPage = () => {
  console.log('WebReceiptPage');

  const [isDownload, setIsDownload] = useState(false);
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
      </div>
    </div>
  );
};

export default WebReceiptPage;
