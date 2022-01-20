import styles from './index.module.scss';
import Image from 'next/image';

function Home() {
  return (
    <div className={styles.home}>
      <Image
        className={styles.cover}
        src='/images/81060246_p0.png'
        layout='fill'
        objectFit='cover'
        priority
      />
      <div className={styles.inner}>
        <h2 className={styles.title}>DAILY</h2>
        <span className={styles.author}>Copyright &copy; 雪町 30959821</span>
      </div>
    </div>
  );
}

export default Home;
