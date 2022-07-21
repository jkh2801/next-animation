import AppHomeBox from './app/HomeBox';
import styles from './HomePage.module.scss';

const AppHomePage = () => {
  return (
    <div className="body flexCenter">
      <video src="/video/bg.mp4" autoPlay loop muted playsInline className={styles.bgVideo} />
      <AppHomeBox />
    </div>
  );
};

export default AppHomePage;
