<script setup lang="ts">
import { computed } from 'vue';

interface ZButtonProps {
  type?: 'primary' | 'success' | 'danger';
  href?: string;
  disabled?: boolean;
}
const props = defineProps<ZButtonProps>();

const tagName = computed(() => (props.href ? 'a' : 'button'));

// 点击事件
const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void;
}>();
const handleClick = (e: MouseEvent) => {
  if (props.disabled) return;
  emit('click', e);
};
</script>

<template>
  <component
    :is="tagName"
    :class="[
      'z-button',
      {
        'z-button__primary': type === 'primary',
        'z-button__success': type === 'success',
        'z-button__danger': type === 'danger',
        'z-button__with-icon': $slots.default && $slots.icon,
        'z-button__only-icon': !$slots.default && $slots.icon,
        'z-button--disabled': disabled,
      },
    ]"
    @click="handleClick"
    :disabled="(!href && disabled) || undefined"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener' : undefined"
  >
    <slot name="icon" />
    <slot />
  </component>
</template>

<style lang="scss" src="./ZButton.scss"></style>
