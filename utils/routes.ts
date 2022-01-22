import minimatch from 'minimatch';
import {
  Home,
  CalendarWeek,
  Swords,
  DiceD6,
  QRCode,
  InfoCircle,
} from '../icons';

export interface Route {
  path: string; // minimatch 表达式
  title: string;
  label?: string; // 菜单专用的缩写
  icon?: SvgrComponent; // 无图标则不显示在菜单
}

const routes: Route[] = [
  {
    path: '/',
    title: '首页',
    icon: Home,
  },
  {
    path: '/bangumi',
    title: '番组每日放送日历',
    label: '每日番组',
    icon: CalendarWeek,
  },
  {
    path: '/katacode',
    title: 'KataCode 片假名加密编码',
    label: 'KataCode',
    icon: QRCode,
  },
  {
    path: '/ffxiv',
    title: 'FF14 中国服狩猎车时间表',
    label: 'FF14 狩猎车',
    icon: Swords,
  },
  {
    path: '/minecraft',
    title: 'Minecraft DSR 系列整合包',
    label: 'MC 整合',
    icon: DiceD6,
  },
  {
    path: '/about',
    title: '关于本站',
    icon: InfoCircle,
  },
];

interface MatchCacheMap {
  [key: string]: Route;
}
const matchCacheMap: MatchCacheMap = {};

/**
 * @param path 来自 next 路由 hook 的当前路径
 */
export function matchRoute(path: string): Route | null {
  if (matchCacheMap[path]) {
    return matchCacheMap[path];
  }

  const matchedRoute = routes.find((route) => minimatch(path, route.path));
  if (matchedRoute) {
    matchCacheMap[path] = matchedRoute;
  }
  return matchedRoute || null;
}

export default routes;
