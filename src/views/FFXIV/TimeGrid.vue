<script setup lang="ts">
import { computed } from 'vue';
import dayjs from '../../utils/dayjs';

interface TimeGridProps {
  times: string[];
  tz: string;
}
const props = defineProps<TimeGridProps>();

/**
 * 转换北京时间到目标时区
 * @param time 北京时间的 HH:mm
 * @param tz 目标时区
 */
const cstToTimeZone = (time: string, tz: string) => {
  // 获取当前北京时间的日期
  const cstDay = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD');
  // 合并北京时间的日期和时间
  const fullCSTTime = `${cstDay} ${time}`;
  // 转换为目标时区的时间
  return dayjs.tz(fullCSTTime, 'Asia/Shanghai').tz(tz);
};

// 转换为目标时区的时间
const zonedTimes = computed(() => {
  return props.times.map((time) => {
    const zonedTime = cstToTimeZone(time, props.tz);
    return zonedTime.format('HH:mm');
  });
});
</script>

<template>
  <div class="time-grid">
    <span class="time-grid__item" v-for="time of zonedTimes" :key="time">
      {{ time }}
    </span>
  </div>
</template>

<style scoped src="./TimeGrid.scss"></style>
