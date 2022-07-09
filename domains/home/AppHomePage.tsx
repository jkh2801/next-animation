import AppHomeBox from './app/HomeBox';
import styles from './HomePage.module.scss';

const AppHomePage = () => {
  console.log('AppHomePage');
  return (
    <div className="body flexCenter">
      <video src="/video/bg.mp4" autoPlay loop muted className={styles.bgVideo} />
      <AppHomeBox />
    </div>
  );
};

export default AppHomePage;
