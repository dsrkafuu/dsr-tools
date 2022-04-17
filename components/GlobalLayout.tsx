import styles from './GlobalLayout.module.scss';
import { useCallback, useRef, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CSSTransition } from 'react-transition-group';
import { matchRoute, Route } from '../utils/routes';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { isCSR, isMobile } from '../utils/env';
import useOutsideClick from '../hooks/useOutsideClick';

interface GlobalLayoutProps {
  children?: React.ReactNode;
}

const route404: Route = { path: '', title: '404 Not Found' };

/**
 * 根应用布局
 */
function GlobalLayout({ children }: GlobalLayoutProps) {
  const router = useRouter();

  // 匹配路由或设置默认 404/500
  const matchedRoute = useMemo<Route>(() => {
    const matched = matchRoute(router.pathname);
    if (!matched) {
      return route404;
    }
    return matched;
  }, [router.pathname]);
  const title = useMemo(
    () => matchedRoute.title + ' | DSRTOOLS',
    [matchedRoute]
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  // SSR 渲染时永远展示侧边栏
  // PC 端访问默认展示侧边栏
  // 移动端访问默认隐藏侧边栏
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return isCSR() && isMobile();
  });
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((pre) => !pre);
  }, []);

  useOutsideClick(sidebarRef, () => {
    if (isMobile()) {
      setSidebarCollapsed(true);
    }
  });

  return (
    <div
      className={styles.layout}
      suppressHydrationWarning // 移动端端侧边栏首次渲染无法保证 SSR 和 CSR 同步
    >
      <Head>
        <title>{title}</title>
      </Head>
      <CSSTransition
        in={!sidebarCollapsed}
        timeout={300}
        classNames='sidebar-animation'
        unmountOnExit
        nodeRef={sidebarRef}
      >
        <aside className={styles.sidebar} ref={sidebarRef}>
          <AppSidebar route={matchedRoute} />
        </aside>
      </CSSTransition>
      <div className={styles.main}>
        <header className={styles.header}>
          <AppHeader
            route={matchedRoute}
            onSidebarCollapseClick={toggleSidebar}
          />
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

export default GlobalLayout;
