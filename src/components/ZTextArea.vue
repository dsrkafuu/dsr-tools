<script setup lang="ts">
interface ZTextAreaProps {
  modelValue: string;
}
defineProps<ZTextAreaProps>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target?.value || '');
};
</script>

<template>
  <textarea
    class="textarea"
    :value="modelValue"
    @input="handleInput"
  ></textarea>
</template>

<style lang="scss" src="./ZTextArea.scss"></style>
