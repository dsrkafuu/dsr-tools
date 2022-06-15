<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { RouterView } from 'vue-router';
import { throttle } from 'dsr-design/utils';
import { isMobile } from './utils/env';
import Sidebar from './views/Sidebar.vue';
import Header from './views/Header.vue';
import { log } from './utils/logger';

// PC 端访问默认展示侧边栏
// 移动端访问默认隐藏侧边栏
const sidebarCollapsed = ref(isMobile());
const toggleSidebar = () => {
  log('toggle sidebar to', !sidebarCollapsed.value);
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
// 响应缩放
let lastEnv = isMobile() ? 'mobile' : 'pc';
const handleResize = throttle(() => {
  const curEnv = isMobile() ? 'mobile' : 'pc';
  if (curEnv !== lastEnv && curEnv === 'pc') {
    log('toggle sidebar to', false);
    sidebarCollapsed.value = false;
  } else if (curEnv !== lastEnv && curEnv === 'mobile') {
    log('toggle sidebar to', true);
    sidebarCollapsed.value = true;
  }
  lastEnv = curEnv;
});
window.addEventListener('resize', handleResize);
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <transition name="sidebar">
    <aside class="aside" v-if="!sidebarCollapsed">
      <Sidebar />
    </aside>
  </transition>
  <div class="content">
    <header class="header">
      <Header @toggle="toggleSidebar" />
    </header>
    <main class="main">
      <RouterView />
    </main>
    <footer></footer>
  </div>
</template>

<style scoped src="./App.scss"></style>
