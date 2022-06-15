<script setup lang="ts">
interface ZExtLinkProps {
  type?: 'primary' | 'success' | 'danger';
  href: string;
}
defineProps<ZExtLinkProps>();
</script>

<template>
  <a
    :class="[
      'z-ext-link',
      {
        'z-ext-link__primary': type === 'primary',
        'z-ext-link__success': type === 'success',
        'z-ext-link__danger': type === 'danger',
      },
    ]"
    :href="href"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
</template>

<style lang="scss" src="./ZExtLink.scss"></style>
