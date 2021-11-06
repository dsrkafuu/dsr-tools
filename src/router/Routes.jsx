import React, { Fragment, Suspense } from 'react';
import { useRoutes, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Spin } from 'antd';
import './Routes.scss';
import index from './index';
import ErrorBoundary from './ErrorBoundary';
import NotFound from '@/views/NotFound';

/**
 * apply each route with metadata
 */
function renderRoute(route) {
  const isNestedRoot = !route.element && route.children;
  if (isNestedRoot) {
    route.element = <Outlet />;
  } else {
    route.element = (
      <Fragment>
        <Helmet>
          <title>{route.meta?.name || ''} | DSRToolS</title>
        </Helmet>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className='router__loading'>
                <Spin size='large' />
              </div>
            }
          >
            {route.element ? <route.element route={route} /> : <NotFound />}
          </Suspense>
        </ErrorBoundary>
      </Fragment>
    );
  }

  // other nested routes
  if (route.children) {
    route.children.forEach((item, idx) => {
      route.children[idx] = renderRoute(item);
    });
  }
  return route;
}

// generate index with HOC
const routes = index.map((item) => renderRoute(item));

/**
 * generate routes
 */
function Routes() {
  return useRoutes(routes);
}

export default Routes;
