import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import 'antd/es/menu/style';
import './Sidebar.scss';
import routes from '@/router/index';
import responsive from '@/utils/responsive';
import Logo from './Logo';

/**
 * map route to component
 * @param {Object} route
 * @param {Object} onRouteClick
 */
function mapRoute(route, onRouteClick, fatherPath) {
  if (!route.meta.hide && route.meta.icon) {
    const newPath = (fatherPath + `/${route.path || ''}`).replace(/\/\//gi, '/');
    // with sub route
    if (route.children) {
      return (
        <Menu.SubMenu key={newPath} icon={<route.meta.icon />} title={route.meta.name}>
          {route.children.map((route) => mapRoute(route, onRouteClick, newPath))}
        </Menu.SubMenu>
      );
    }
    // no sub route
    else {
      return (
        <Menu.Item
          key={newPath}
          icon={<route.meta.icon />}
          onClick={(d) => onRouteClick(d.domEvent)}
        >
          <Link to={newPath}>{route.meta.short || route.meta.name}</Link>
        </Menu.Item>
      );
    }
  }
  // do not render hided routes
  else {
    return null;
  }
}

function Sidebar({ collapsed, onRouteClick }) {
  // current route
  const location = useLocation();
  const active = location.pathname;
  // current opened group
  const [opened] = useState(() => {
    let arr = ['/' + active?.split('/')[1] || ''];
    if (responsive() !== 'lg') {
      arr = [];
    }
    return arr;
  });

  return (
    <Menu className='sidebar' mode='inline' selectedKeys={[active]} defaultOpenKeys={opened}>
      <Menu.Item className='sidebar__icon' key='icon' title={null}>
        <Logo collapsed={collapsed} />
      </Menu.Item>
      {routes.map((route) => mapRoute(route, onRouteClick, '/'))}
    </Menu>
  );
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default Sidebar;
