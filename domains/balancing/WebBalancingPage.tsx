import styles from './Balancing.module.scss';
import cn from 'classnames';
import { HomeButton } from '@components/button';
import { useState } from 'react';

export const WebBalancingPage = () => {
  const [inputs, setInputs] = useState({
    left: 0,
    right: 0,
  });

  const handleSetInputs = (isLeft: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = e.target.value;
    if (text) {
      const num = Number(text);
      if (!isNaN(num)) {
        if (isLeft) inputs.left = num;
        else inputs.right = num;
        setInputs({ ...inputs });
      }
    } else {
      if (isLeft) inputs.left = 0;
      else inputs.right = 0;
      setInputs({ ...inputs });
    }
  };
  const getMax = () => {
    const diff = Math.abs(inputs.left - inputs.right);
    let active = '';
    if (diff === 0) {
      return '';
    }
    if (inputs.left > inputs.right) active += 'leftActive-';
    else active += 'rightActive-';
    if (diff < 7) active += diff;
    else active += 7;
    return styles[active];
  };
  return (
    <div className="body flexCenter hidden" style={{ background: 'linear-gradient(180deg, #000735, #232323)' }}>
      <HomeButton />
      <div className={styles.wrapper}>
        <div className={cn(styles.line, getMax())}>
          <div className={cn(styles.left, styles.area, getMax())}>
            <input type="text" className={cn('fs-50', styles.input)} value={inputs.left} onChange={e => handleSetInputs(true, e)} />
            <div className={styles.plain}></div>
          </div>
          <div className={cn(styles.right, styles.area, getMax())}>
            <input type="text" className={cn('fs-50', styles.input)} value={inputs.right} onChange={e => handleSetInputs(false, e)} />
            <div className={styles.plain}></div>
          </div>
        </div>
        <div className={styles.body}></div>
      </div>
    </div>
  );
};
