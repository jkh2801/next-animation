import { SetStateType } from '@customTypes/CommonTypes';
import { InfoTypes } from '@customTypes/ReceiptTypes';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import styles from './Calendar.module.scss';
import LeftArrowIcon from '@assets/leftArrowIcon.svg';
import RightArrowIcon from '@assets/rightArrowIcon.svg';
import cn from 'classnames';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isBetween from 'dayjs/plugin/isBetween';

type PropTypes = {
  info: InfoTypes;
  setInfo: SetStateType<InfoTypes>;
};

export const Calendar: FC<PropTypes> = ({ info, setInfo }) => {
  dayjs.extend(isBetween);
  dayjs.extend(weekOfYear);
  const { date } = info;
  const [isActive, setIsActive] = useState(false);
  const [select, setSelect] = useState(date.clone());
  const [month, setMonth] = useState(dayjs());
  const HEADER = ['일', '월', '화', '수', '목', '금', '토'];

  const getDays = () => {
    const start = month.clone().startOf('month');
    const end = month.clone().endOf('month');
    const week: number[] = [];
    for (let w = start.week(); w <= end.week(); w++) {
      week.push(w);
    }
    if (end.week() < start.week()) {
      for (let w = start.week() === 48 ? 48 : start.week() - 1; w <= 53; w++) {
        week.push(w);
      }
    }
    return week.map((w, idx) => {
      return (
        <div key={idx} className={styles.body}>
          {Array(7)
            .fill(0)
            .map((n, i) => {
              let current: dayjs.Dayjs = month
                .clone()
                .startOf('year')
                .week(w)
                .startOf('week')
                .add(n + i, 'day');

              let isSame: boolean = current.isSame(select.format('YYYY-MM-DD'));
              let isMonthBefore: boolean = current.isBefore(month.clone().startOf('month'));
              let isMonthAfter: boolean = current.isAfter(month.clone().endOf('month'));
              const setDate = () => {
                setSelect(current.clone());
                setInfo({ ...info, date: current.clone() });
                setIsActive(false);
              };
              return (
                <span
                  key={i}
                  className={cn('flexCenter', styles.content)}
                  onClick={() => setDate()}
                  style={{
                    background: isSame ? '#54DEF6' : '#fff',
                  }}
                >
                  <span
                    className={'flexCenter'}
                    style={{
                      opacity: isMonthBefore || isMonthAfter ? 0.5 : 1,
                    }}
                  >
                    <span className="number" style={{ color: isSame ? '#fff' : '#222' }}>
                      {current.format('D')}
                    </span>
                  </span>
                </span>
              );
            })}
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <span className={cn('number', styles.cursor)} onClick={() => setIsActive(!isActive)}>
        {date.clone().format('YYYY.MM.DD')}
      </span>
      {isActive && (
        <div className={styles.box}>
          <div className="flexEvenlyCenter">
            <div onClick={() => setMonth(month.clone().subtract(1, 'months'))}>
              <LeftArrowIcon />
            </div>
            <span className="number">{month.format('YYYY.MM')}</span>
            <div onClick={() => setMonth(month.clone().add(1, 'months'))}>
              <RightArrowIcon />
            </div>
          </div>
          <div className={styles.header}>
            {HEADER.map((str, idx) => (
              <span key={idx} className={cn('flexCenter fw-500', styles.text)}>
                {str}
              </span>
            ))}
          </div>
          {getDays()}
        </div>
      )}
    </div>
  );
};
