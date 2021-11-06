import { lazy } from 'react';
import {
  HomeOutlined,
  InfoCircleOutlined,
  CloudSyncOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  MacCommandOutlined,
  CodeOutlined,
} from '@ant-design/icons';

const NotFoundRoute = {
  element: lazy(() => import('@/views/NotFound')),
  meta: {
    name: '404 NOT FOUND',
    hide: true,
  },
};

export default [
  {
    index: true,
    element: lazy(() => import('@/views/Home')),
    meta: {
      name: '首页',
      icon: HomeOutlined,
    },
  },
  {
    path: 'anime',
    element: lazy(() => import('@/views/Anime')),
    meta: {
      name: '番组每日放送',
      short: '每日番组',
      icon: CalendarOutlined,
    },
  },
  {
    path: 'katacode',
    element: lazy(() => import('@/views/KataCode')),
    meta: {
      name: 'KataCode 片假名加密编码',
      short: '片假加密编码',
      icon: CodeOutlined,
    },
  },
  {
    path: 'game',
    meta: {
      name: '游戏工具',
      icon: PlayCircleOutlined,
    },
    children: [
      {
        index: true,
        ...NotFoundRoute,
      },
      {
        path: 'ffxiv',
        element: lazy(() => import('@/views/Game/FFXIV')),
        meta: {
          name: 'FF14 国服狩猎车时间表',
          short: 'FF14 狩猎时间表',
          icon: FieldTimeOutlined,
        },
      },
      {
        path: 'minecraft',
        exact: true,
        element: lazy(() => import('@/views/Game/Minecraft')),
        meta: {
          name: 'Minecraft DSRCA 整合包',
          short: 'MC 整合包',
          icon: MacCommandOutlined,
        },
      },
    ],
  },
  {
    path: 'about',
    meta: {
      name: '关于',
      icon: InfoCircleOutlined,
    },
    children: [
      {
        index: true,
        ...NotFoundRoute,
      },
      {
        path: 'changelog',
        element: lazy(() => import('@/views/About/Changelog')),
        meta: {
          name: '更新记录',
          icon: CloudSyncOutlined,
        },
      },
      {
        path: 'info',
        element: lazy(() => import('@/views/About/Info')),
        meta: {
          name: '站点信息',
          icon: FileTextOutlined,
        },
      },
    ],
  },
  {
    path: 'notification',
    element: lazy(() => import('@/views/Notification')),
    meta: {
      name: '通知',
      hide: true,
    },
  },
  {
    path: '*',
    ...NotFoundRoute,
  },
];
