import Link from 'next/link';
import cn from 'classnames';
import styles from './HomeButton.module.scss';
import HouseIcon from '@assets/houseIcon.svg';

export const HomeButton = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a href="">
          <HouseIcon />
        </a>
      </Link>
    </div>
  );
};
