<script setup lang="ts">
import { computed, onBeforeUnmount, ref, VNodeRef } from 'vue';
import { RouterLink } from 'vue-router';
import { routes } from '../router';
import { ZExtLink } from '../components';

const emit = defineEmits<{
  (event: 'click:outside'): void;
}>();

const sidebarRoutes = computed(() => {
  return routes.filter((route) => !!route.meta.icon);
});

// 外侧点击处理
const sidebarRef = ref<VNodeRef | null>(null);
const clickHandler = (e: MouseEvent | PointerEvent) => {
  const target = e.target as HTMLElement | null;
  if (target && sidebarRef.value) {
    // 是否为侧边栏内侧的点击
    const isInnerClick = (sidebarRef.value as HTMLDivElement).contains(target);
    if (!isInnerClick) {
      // 检查是否为点击菜单按钮
      let isMenuBtn = false;
      let node: HTMLElement | null = target;
      while (node) {
        if (node.id === 'menu-btn') {
          isMenuBtn = true;
          break;
        }
        node = node.parentElement;
      }
      if (!isMenuBtn) {
        emit('click:outside');
      }
    }
  }
};
window.addEventListener('click', clickHandler);
onBeforeUnmount(() => {
  window.removeEventListener('click', clickHandler);
});
</script>

<template>
  <div class="sidebar" ref="sidebarRef">
    <div class="icon">DSRTOOLS🍥<span class="icon-version">v6</span></div>
    <div class="menu">
      <RouterLink
        v-for="route of sidebarRoutes"
        :to="route.path"
        :key="route.path"
        class="menu__item"
      >
        <component :is="route.meta.icon" />
        {{ route.meta.shortTitle || route.meta.title }}
      </RouterLink>
    </div>
    <footer class="footer">
      <ZExtLink class="counter" href="https://count.dsrkafuu.net/">
        <img
          src="https://count.dsrkafuu.net/dsrkafuu:tools?length=6"
          alt="计数器"
          loading="lazy"
        />
      </ZExtLink>
      <span>Copyright &copy; 2019-{{ new Date().getFullYear() }}</span>
      <span>AGPL-3.0 | DSRKafuU</span>
    </footer>
  </div>
</template>

<style scoped src="./Sidebar.scss"></style>
