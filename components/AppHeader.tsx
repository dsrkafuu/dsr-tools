import styles from './AppHeader.module.scss';
import { useState, useEffect, useCallback } from 'react';
import { message } from './ZMessage';
import clsx from 'clsx';
import dayjs from '../utils/dayjs';
import { Route } from '../utils/routes';
import { Sync, ShareAlt, Bars } from '../icons';
import ZButton from './ZButton';
// import AppBanner from './AppBanner';

interface AppHeaderProps {
  route: Route;
  onSidebarCollapseClick: () => void;
}

/**
 * 页面统一 Header
 */
function AppHeader({ route, onSidebarCollapseClick }: AppHeaderProps) {
  // 本地时钟
  const getLocalTime = useCallback(() => {
    return 'LOC ' + dayjs().format('HH:mm:ss');
  }, []);
  const [localTime, setLocalTime] = useState(getLocalTime);
  // 标准时间时钟
  const getUTCTime = useCallback(() => {
    return 'UTC ' + dayjs().utc().format('HH:mm:ss');
  }, []);
  const [utcTime, setUTCTime] = useState(getUTCTime);
  // 刷新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(getLocalTime());
      setUTCTime(getUTCTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [getLocalTime, getUTCTime]);

  // 时钟切换
  const [timeMode, setTimeMode] = useState<'utc' | 'local'>('local');
  const toggleTimeMode = useCallback(() => {
    setTimeMode((pre) => (pre === 'local' ? 'utc' : 'local'));
  }, []);

  // 复制链接
  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(
      () => message.success('已复制链接至剪贴板'),
      () => message.error('复制链接失败')
    );
  }, []);

  return (
    <>
      {/* <AppBanner /> */}
      <div className={styles.header}>
        <div className={styles.control}>
          <ZButton
            type='primary'
            icon={<Bars />}
            onClick={onSidebarCollapseClick}
          />
        </div>
        <div className={styles.meta}>
          <h1 className={styles.title}>{route.title}</h1>
          <span className={clsx(styles.subTitle, styles.hideOnMobile)}>
            DSRTOOLS
          </span>
        </div>
        <div className={styles.rightSide}>
          <ZButton
            className={clsx(styles.clock, styles.hideOnMobile)}
            onClick={toggleTimeMode}
            suppressHydrationWarning // 时间无法保证 SSR 和 CSR 同步
          >
            {timeMode === 'local' ? localTime : utcTime}
          </ZButton>
          <ZButton
            className={styles.hideOnMobile}
            type='primary'
            icon={<Sync />}
            onClick={() => window.location.reload()}
          />
          <ZButton type='primary' icon={<ShareAlt />} onClick={copyShareLink} />
        </div>
      </div>
    </>
  );
}

export default AppHeader;
