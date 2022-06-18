<script setup lang="ts">
interface ZRadioProps {
  value: boolean;
}
defineProps<ZRadioProps>();

// 点击事件
const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void;
}>();
const handleClick = (e: MouseEvent) => {
  emit('click', e);
};
</script>

<template>
  <label class="z-radio">
    <input
      class="z-radio__inner"
      type="radio"
      :checked="value"
      @click="handleClick"
    />
    <slot />
  </label>
</template>

<style lang="scss" src="./ZRadio.scss"></style>
