<script setup lang="ts">
interface ZSelectProps {
  name: string;
  options: string[];
  modelValue: string;
}
defineProps<ZSelectProps>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();
const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emit('update:modelValue', target?.value || '');
};
</script>

<template>
  <div class="z-select">
    <select
      class="z-select__inner"
      :value="modelValue"
      @change="handleChange"
      :name="name"
    >
      <option v-for="item of options" :key="item" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" src="./ZSelect.scss"></style>
