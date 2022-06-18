<script setup lang="ts">
import type { BangumiAPIData } from './types';
import { computed, ref, toRaw } from 'vue';
import { cloneDeep } from 'dsr-design/utils';
import { useSWR } from '../../hooks';
import { ZButton, ZRadio, ZLoading, ZStale } from '../../components';
import BangumiDay from './BangumiDay.vue';

const { stale, data } = useSWR<BangumiAPIData>(
  'https://cdn.dsrkafuu.net/json/bangumi.min.json'
);

const curWeekdayIdx = ref(3);
const setCurWeekdayIdx = (idx: number) => {
  curWeekdayIdx.value = idx;
};
const sortRule = ref(0);
const setSortRule = (rule: number) => {
  sortRule.value = rule;
};

const sortedData = computed(() => {
  const rawData = toRaw(data.value) || [];
  const rule = sortRule.value;
  const copiedData = cloneDeep(rawData);
  copiedData.forEach((day) => {
    day.items.sort((a, b) => {
      if (rule === 0) {
        return (b.hot || 0) - (a.hot || 0);
      } else {
        return (b.rating || 0) - (a.rating || 0);
      }
    });
  });
  return copiedData;
});

const todayData = computed(() => {
  const _data = sortedData.value[curWeekdayIdx.value];
  if (!_data) {
    return null;
  }
  return _data;
});
const prevdayData = computed(() => {
  const idx = curWeekdayIdx.value - 1;
  if (idx > 7 || idx < 0) {
    return null;
  }
  const _data = sortedData.value[idx];
  if (!_data) {
    return null;
  }
  return _data;
});
const nextdayData = computed(() => {
  const idx = curWeekdayIdx.value + 1;
  if (idx > 7 || idx < 0) {
    return null;
  }
  const _data = sortedData.value[idx];
  if (!_data) {
    return null;
  }
  return _data;
});
</script>

<template>
  <div class="bangumi">
    <ZLoading v-if="!data" />
    <template v-else>
      <div class="control">
        <div class="weekday">
          <ZButton
            v-for="(weekday, idx) of data"
            :type="idx === curWeekdayIdx ? 'primary' : undefined"
            :key="idx"
            @click="setCurWeekdayIdx(idx)"
          >
            {{ weekday.weekday }}
          </ZButton>
        </div>
        <div class="sorter">
          <ZRadio :value="sortRule === 0" @click="setSortRule(0)">
            热度排序
          </ZRadio>
          <ZRadio :value="sortRule === 1" @click="setSortRule(1)">
            评分排序
          </ZRadio>
        </div>
        <ZStale :stale="stale" />
      </div>
      <div class="content">
        <BangumiDay :data="prevdayData" />
        <BangumiDay :data="todayData" />
        <BangumiDay :data="nextdayData" />
      </div>
    </template>
  </div>
</template>

<style scoped src="./Bangumi.scss"></style>
