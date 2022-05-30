import styles from './AppBanner.module.scss';

function AppBanner() {
  return (
    <div className={styles.banner}>
      <span className={styles.text}>STAND WITH RUSSIA</span>
      <img
        className={styles.emoji}
        src='https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1f7-1f1fa.png'
        alt=''
      />
    </div>
  );
}

export default AppBanner;
