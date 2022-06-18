<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import dayjs from '../utils/dayjs';
import { IBars, ISignIn, IUser } from '../icons';
import { useAuthStore } from '../store/auth';
import { ZButton } from '../components';
import User from './User.vue';

// 菜单事件
const emit = defineEmits<{
  (event: 'toggle', e: MouseEvent): void;
}>();

/**
 * 获取本地时钟
 */
const getLocalTime = () => {
  return 'LOC ' + dayjs().format('HH:mm:ss');
};
/**
 * 获取 UTC 时钟
 */
const getUTCTime = () => {
  return 'UTC ' + dayjs().utc().format('HH:mm:ss');
};
const localTime = ref(getLocalTime());
const utcTime = ref(getUTCTime());
// 刷新时间
const timer = setInterval(() => {
  localTime.value = getLocalTime();
  utcTime.value = getUTCTime();
}, 1000);
onBeforeUnmount(() => {
  clearInterval(timer);
});
const timeMode = ref<'utc' | 'local'>('local');
/**
 * 时钟切换
 */
const toggleTimeMode = () => {
  timeMode.value = timeMode.value === 'local' ? 'utc' : 'local';
};

const authStore = useAuthStore();
const showUser = ref(false);
const handleMouseEnter = () => {
  if (!authStore.loggedIn) return;
  showUser.value = true;
};
const handleMouseLeave = () => {
  if (!authStore.loggedIn) return;
  showUser.value = false;
};
</script>

<template>
  <div class="header">
    <div class="menu">
      <ZButton type="primary" @click="emit('toggle', $event)">
        <template #icon><IBars /></template>
      </ZButton>
    </div>
    <div class="meta">
      <h1 class="title">{{ $route.meta.title }}</h1>
      <span class="subtitle">DSRTOOLS</span>
    </div>
    <div class="control">
      <ZButton class="clock" @click="toggleTimeMode">
        {{ timeMode === 'local' ? localTime : utcTime }}
      </ZButton>
      <ZButton
        type="primary"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        disabled
      >
        <template #icon>
          <component :is="authStore.loggedIn ? IUser : ISignIn" />
        </template>
      </ZButton>
      <transition name="user">
        <User v-if="authStore.loggedIn && showUser" />
      </transition>
    </div>
  </div>
</template>

<style scoped src="./Header.scss"></style>
