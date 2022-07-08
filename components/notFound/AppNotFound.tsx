import styles from './AppNotFound.module.scss';
import cn from 'classnames';
import { HomeButton } from '@components/button';

export const AppNotFound = () => {
  return (
    <div className={cn('body hideen flexCenter', styles.wrapper)}>
      <HomeButton />
      <div className={cn('flexColumn', styles.container)}>
        <div className={cn('flexCenter gap-10', styles.textBox)}>
          <span className="number fs-50 fw-700">4</span>
          <span className="number fs-50 fw-700">0</span>
          <span className="number fs-50 fw-700">4</span>
        </div>
        <div className="flexCenter">
          <span className="number fs-30 fw-700 ">Page Not Found</span>
        </div>
      </div>
    </div>
  );
};
