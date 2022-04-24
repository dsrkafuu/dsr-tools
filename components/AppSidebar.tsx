import styles from './AppSidebar.module.scss';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import routes, { Route } from '../utils/routes';

interface AppSidebarProps {
  route: Route;
}

interface RouteWithMatch extends Route {
  matched: boolean;
}

/**
 * 包含 icon、菜单和 footer 的可切换侧边栏
 */
function AppSidebar({ route }: AppSidebarProps) {
  const routesWithMatched = useMemo<RouteWithMatch[]>(() => {
    return routes.map((item) => ({
      ...item,
      matched: item.path === route.path,
    }));
  }, [route]);

  return (
    <div className={clsx(styles.sidebar)}>
      <div className={styles.siteIcon}>
        <Image
          className={styles.siteIconImage}
          src='/images/logo.png'
          width={80}
          height={80}
        />
      </div>
      <div className={styles.menu}>
        {routesWithMatched.map((route) => {
          const Icon = route.icon;
          // 不显示没有图标的路由
          if (!Icon) {
            return null;
          }
          return (
            <Link href={route.path} key={route.path} passHref>
              <div
                className={clsx(styles.menuItem, {
                  [styles.menuItem_active]: route.matched,
                })}
              >
                <div className={styles.menuIcon}>
                  <Icon />
                </div>
                <div className={styles.menuLabel}>
                  {route.label || route.title}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <a
        className={styles.counter}
        href='https://count.dsrkafuu.net/'
        target='_blank'
        rel='noopener'
      >
        <img
          src='https://count.dsrkafuu.net/dsrkafuu:tools?length=6'
          alt='计数器'
        />
      </a>
      <div className={styles.footer}>
        <span>Copyright &copy; 2019-{new Date().getFullYear()}</span>
        <span>AGPL-3.0 | DSRKafuU</span>
      </div>
    </div>
  );
}

export default AppSidebar;
