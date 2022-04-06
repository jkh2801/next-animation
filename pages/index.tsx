import styles from '@styles/homepage.module.scss';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HomeBox = dynamic(() => import('@domains/home'));

export default function HomePage() {
  console.log('Home');
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    const mainLoading = localStorage.getItem('main-loading');
    setStatus(mainLoading ? '' : 'active');
    // localStorage.setItem('main-loading', 'success');
  }, []);
  return (
    <div className="body flexCenter">
      <video src="/video/bg.mp4" autoPlay loop muted className={styles.bgVideo} />
      {status !== 'loading' && <HomeBox status={status} setStatus={setStatus} />}
    </div>
  );
}
