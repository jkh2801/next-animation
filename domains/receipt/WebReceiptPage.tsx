import { HomeButton } from '@components/button';
import cn from 'classnames';
import dayjs from 'dayjs';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import styles from './Receipt.module.scss';
import DownloadIcon from '@assets/downloadIcon.svg';
import { Calendar } from './web/Calendar';
import { InfoTypes } from '@customTypes/ReceiptTypes';
import PlusIcon from '@assets/plusIcon.svg';

type DescTypes = {
  name: string;
  price: number;
};

const WebReceiptPage = () => {
  console.log('WebReceiptPage');
  const ref = useRef<HTMLDivElement>(null);
  const [isDownload, setIsDownload] = useState(false);
  const [info, setInfo] = useState<InfoTypes>({
    name: 'Shop Name or Shop Address',
    date: dayjs(),
    manager: 'Representative Name',
  });

  const [list, setList] = useState<DescTypes[]>([
    {
      name: 'EXAMPLE',
      price: 1000000,
    },
  ]);
  const totalPrice = list.reduce((pre, cur) => {
    pre += cur.price;
    return pre;
  }, 0);

  const handleSetDescName = (idx: number, value: string) => {
    list[idx].name = value;
    setList([...list]);
  };

  const handleSetDescPrice = (idx: number, value: string) => {
    let numberReg = /^[0-9]+$/;
    if (numberReg.test(value)) {
      list[idx].price = Number(value);
      setList([...list]);
    }
  };

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

  const handleAddDesc = () => {
    list.push({
      name: 'EXAMPLE',
      price: 0,
    });
    setList([...list]);
  };

  const clickEvent = () => {
    setIsDownload(true);
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
        setIsDownload(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const formatPrice = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  };

  return (
    <div className="body flexCenter hidden" style={{ background: '#7bffa3' }}>
      <HomeButton />
      <button className={styles.download} onClick={clickEvent}>
        <DownloadIcon />
      </button>
      <div className={cn('flexCenter', styles.wrapper)} ref={ref}>
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
              {isDownload ? <span className="number">{info.date.clone().format('YYYY.MM.DD')}</span> : <Calendar info={info} setInfo={setInfo} />}
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
          <div>
            <p className={cn('fs-20 fw-500 number', styles.subTitle)}>Description</p>
            {!isDownload && (
              <span className={cn('flexCenter', styles.plusIcon)} onClick={handleAddDesc}>
                <PlusIcon />
              </span>
            )}
          </div>
          <div className={cn('auto', styles.descBox, isDownload && styles.active)}>
            {list.map((info, idx) => {
              return (
                <div key={idx} className={cn('flexBetweenCenter', styles.row)}>
                  <span className={styles.head}>
                    {isDownload ? (
                      <span className="number">{info.name}</span>
                    ) : (
                      <input type="text" className={cn('number', styles.input)} value={info.name} onChange={e => handleSetDescName(idx, e.target.value)} />
                    )}
                  </span>
                  <span className={styles.price}>
                    {isDownload ? (
                      <span className="number">{formatPrice(info.price)}</span>
                    ) : (
                      <input type="text" className={cn('number', styles.input)} value={info.price} onChange={e => handleSetDescPrice(idx, e.target.value)} />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={cn('flexBetweenCenter', styles.totalBox)}>
            <span className="fs-20 fw-500 number">Total</span>
            <span className="number">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebReceiptPage;
