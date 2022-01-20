import styles from './bangumi.module.scss';
import ZCover from '../components/ZCover';

function Bangumi() {
  return (
    <div className={styles.container}>
      <ZCover type='construction' />
    </div>
  );
}

export default Bangumi;
