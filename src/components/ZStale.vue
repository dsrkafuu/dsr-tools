<script setup lang="ts">
import { ISpinnerThird, ICheckCircle } from '../icons';

interface ZStaleProps {
  stale: boolean;
}
defineProps<ZStaleProps>();
</script>

<template>
  <div :class="['z-stale', { 'z-stale--success': !stale }]">
    <ISpinnerThird v-if="stale" />
    <ICheckCircle v-else />
  </div>
</template>

<style lang="scss" src="./ZStale.scss"></style>
