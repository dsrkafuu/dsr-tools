<script setup lang="ts">
/**
 * @fileoverview
 * 可以通过插槽自定义的列表，默认显示 content 属性
 */

interface ZListItem {
  title?: string;
  [key: string]: unknown;
}
interface ZListProps {
  list: ZListItem[];
  inline?: boolean;
}
defineProps<ZListProps>();
</script>

<template>
  <div :class="['z-list', { 'z-list--inline': inline }]">
    <div
      class="z-list__section"
      v-for="(item, idx) of list"
      :key="item.title || idx"
    >
      <span class="z-list__title" v-if="item.title">{{ item.title }}</span>
      <div class="z-list__content">
        <slot :item="item">
          {{ item.content || JSON.stringify(item) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./ZList.scss"></style>
