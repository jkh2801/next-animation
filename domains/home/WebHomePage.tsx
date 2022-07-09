import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import dynamic from 'next/dynamic';

const WebHomeBox = dynamic(() => import('./web/HomeBox'));

const WebHomePage = () => {
  console.log('WebHomePage');
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    const mainLoading = localStorage.getItem('main-loading');
    setStatus(mainLoading ? '' : 'active');
    localStorage.setItem('main-loading', 'success');
  }, []);
  return (
    <div className="body flexCenter">
      <video src="/video/bg.mp4" autoPlay loop muted className={styles.bgVideo} />
      {status !== 'loading' && <WebHomeBox status={status} setStatus={setStatus} />}
    </div>
  );
};

export default WebHomePage;
