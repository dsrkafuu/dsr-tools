import styles from './ZCover.module.scss';
import { useMemo } from 'react';
import clsx from 'clsx';

import { BugFixing, PageNotFound, UnderConstruction } from '../undraw';
import ZButton from './ZButton';
import { useRouter } from 'next/router';

interface ZCoverProps {
  type?: 'error' | '404' | 'construction';
  className?: string;
}

function ZCover({ type = 'error', className }: ZCoverProps) {
  const icon = useMemo(() => {
    switch (type) {
      case 'error':
        return <BugFixing />;
      case '404':
        return <PageNotFound />;
      case 'construction':
        return <UnderConstruction />;
      default:
        return null;
    }
  }, [type]);

  const text = useMemo(() => {
    switch (type) {
      case 'error':
        return '页面渲染失败';
      case '404':
        return '404 Not Found';
      case 'construction':
        return '功能正在建设中';
      default:
        return '';
    }
  }, [type]);

  const router = useRouter();

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.undraw}>{icon}</div>
      <p className={styles.text}>{text}</p>
      <ZButton
        className={styles.btn}
        type='primary'
        onClick={() => router.push('/')}
      >
        返回首页
      </ZButton>
    </div>
  );
}

export default ZCover;
