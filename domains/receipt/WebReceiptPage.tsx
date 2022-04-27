import { HomeButton } from '@components/button';
import cn from 'classnames';
import dayjs from 'dayjs';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import styles from './Receipt.module.scss';
import DownloadIcon from '@assets/downloadIcon.svg';

const WebReceiptPage = () => {
  console.log('WebReceiptPage');
  const ref = useRef<HTMLDivElement>(null);
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

  const clickEvent = () => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="body flexCenter" style={{ background: '#7bffa3' }} ref={ref}>
      <HomeButton />
      <button className={styles.download} onClick={clickEvent}>
        <DownloadIcon />
      </button>
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
