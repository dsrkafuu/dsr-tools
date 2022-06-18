<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { routes } from '../router';
import { ZExtLink } from '../components';

const sidebarRoutes = computed(() => {
  return routes.filter((route) => !!route.meta.icon);
});
</script>

<template>
  <div class="sidebar">
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
