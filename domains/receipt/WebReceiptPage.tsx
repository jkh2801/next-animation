import { HomeButton } from '@components/button';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Receipt.module.scss';

const WebReceiptPage = () => {
  console.log('WebReceiptPage');

  return (
    <div className="body flexCenter" style={{ background: '#F6F7FB' }}>
      <HomeButton />
      <div className={styles.container}>
        <p className={cn('fs-30 fw-700 number', styles.title)}>Receipt</p>
      </div>
    </div>
  );
};

export default WebReceiptPage;
