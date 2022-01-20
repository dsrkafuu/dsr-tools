import styles from './changelog.module.scss';
import { Timeline } from 'antd';
import changelog from '../utils/changelog';

function Changelog() {
  return (
    <div className={styles.changelog}>
      <Timeline mode='left'>
        {changelog.map((item, idx) => (
          <Timeline.Item
            label={item.date}
            key={item.version}
            color={idx === 0 ? 'green' : 'blue'}
          >
            <p>{item.version}</p>
            {item.logs.map((t, idx) => (
              <p key={idx}>{t}</p>
            ))}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default Changelog;
