import styles from './AppBanner.module.scss';

function AppBanner() {
  return (
    <div className={styles.banner}>
      <span className={styles.text}>I STAND WITH RUSSIA</span>
      <img
        className={styles.emoji}
        src='https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/72x72/1f1f7-1f1fa.png'
        alt=''
      />
    </div>
  );
}

export default AppBanner;
