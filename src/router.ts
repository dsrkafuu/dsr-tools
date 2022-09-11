import { createRouter, createWebHistory } from 'vue-router';
import { log } from './utils/logger';
import {
  IDiceD6,
  IHome,
  IInfoCircle,
  IQRCode,
  ICalendarWeek,
  IGrinSquintTears,
} from './icons';

export const routes = [
  {
    path: '/',
    component: () => import('./views/Home/Home.vue'),
    meta: {
      icon: IHome,
      title: '首页',
    },
  },
  {
    path: '/bangumi',
    component: () => import('./views/Bangumi/Bangumi.vue'),
    meta: {
      icon: ICalendarWeek,
      title: '番组每日放送日历',
      shortTitle: '每日番组',
    },
  },
  {
    path: '/katacode',
    component: () => import('./views/KataCode/KataCode.vue'),
    meta: {
      icon: IQRCode,
      title: 'KataCode 片假名加密编码',
      shortTitle: 'KataCode',
    },
  },
  {
    path: '/emojikitchen',
    component: () => import('./views/EmojiKitchen/EmojiKitchen.vue'),
    meta: {
      icon: IGrinSquintTears,
      title: 'Emoji Kitchen',
      shortTitle: 'Emoji 合成',
    },
  },
  {
    path: '/minecraft',
    component: () => import('./views/Minecraft/Minecraft.vue'),
    meta: {
      icon: IDiceD6,
      title: 'DSR Minecraft 原版整合包',
      shortTitle: 'DSRVMC 整合包',
    },
  },
  {
    path: '/about',
    component: () => import('./views/About/About.vue'),
    meta: {
      icon: IInfoCircle,
      title: '关于本站',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('./views/NotFound.vue'),
    meta: {
      title: '404 Not Found',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  log('route to', to.path);
});

router.afterEach((to) => {
  const title = to.meta.title as string;
  document.title = title + ' | DSRTOOLS';
});

export default router;
