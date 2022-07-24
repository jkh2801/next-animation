import { HomeButton } from '@components/button';
import cn from 'classnames';
import { useRef } from 'react';
import styles from './GreenHouse.module.scss';

const WebGreenHousePage = () => {
  const canvas = useRef(null);
  return (
    <div className="body flexCenter hidden">
      <HomeButton />
      <div className={styles.container}>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default WebGreenHousePage;
