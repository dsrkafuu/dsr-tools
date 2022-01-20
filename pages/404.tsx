import styles from './404.module.scss';
import ZCover from '../components/ZCover';

function Custom404() {
  return (
    <div className={styles.container}>
      <ZCover type='404' />
    </div>
  );
}

export default Custom404;
