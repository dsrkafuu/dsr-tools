import styles from './index.module.scss';

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.cover}></div>
      <div className={styles.inner}>
        <h2 className={styles.title}>DAILY</h2>
      </div>
    </div>
  );
}

export default Home;
