<script setup lang="ts">
import type { FFXIVData } from './types';
import { computed, ref, watch } from 'vue';
import dayjs, { tzdb, isDST } from '../../utils/dayjs';
import { getLS, setLS } from '../../utils/storage';
import { useSWR } from '../../hooks';
import {
  ZButton,
  ZSelect,
  ZList,
  ZExtLink,
  ZLoading,
  ZStale,
} from '../../components';
import TimeGrid from './TimeGrid.vue';

// 拉取数据
const { stale, data } = useSWR<FFXIVData | null>(
  'https://cdn.dsrkafuu.net/json/ffxiv.min.json'
);

const infoList = [
  {
    title: '关于本站',
    content: '自 2020 年 2 月运营至今，国服最早的全区服狩猎时间汇总站',
  },
  {
    title: '数据更新',
    content:
      '数据更新后 CDN 缓存需要约 10-15 分钟全球刷新，若出现问题则最高需要 12 小时',
  },
  {
    title: 'NGA 原帖',
    content: 'https://nga.178.com/read.php?tid=20339590',
  },
  {
    title: '联系方式',
    content: '请至 NGA 原帖回复或联系 QQ 2366715664',
  },
];

// tab 设置
type DataCenter = 'chocobo' | 'moogle' | 'cat' | 'dog';
// 当前实际显示的 tab
const validTabs: Array<{ query: DataCenter; name: string }> = [
  { query: 'chocobo', name: '陆行鸟' },
  { query: 'moogle', name: '莫古力' },
  { query: 'cat', name: '猫小胖' },
  { query: 'dog', name: '豆豆柴' },
];
let initialTab: DataCenter = 'chocobo';
const savedTab = getLS('ffxiv:tab');
if (savedTab && validTabs.find((v) => v.query === savedTab)) {
  initialTab = savedTab as DataCenter;
}
const curTab = ref(initialTab);
const handleSwitchTab = (tab: DataCenter) => {
  curTab.value = tab;
  setLS('ffxiv:tab', tab);
};

// 时区设置
let initialTZ = 'Asia/Shanghai';
const savedTZ = getLS<string>('ffxiv:tz');
const guessTz = dayjs.tz.guess();
if (savedTZ && tzdb.includes(savedTZ)) {
  initialTZ = savedTZ;
} else if (tzdb.includes(guessTz)) {
  initialTZ = guessTz;
}
const curTZ = ref(initialTZ);
watch(curTZ, (newTZ) => {
  curTZ.value = newTZ;
  setLS('ffxiv:tz', newTZ);
});

// 更新时间
const updateMessage = computed(() => {
  const updateTime = dayjs(data.value?.time || 0).tz(curTZ.value);
  let text = `生成于 ${updateTime.format('YYYY-MM-DD HH:mm')}`;
  if (isDST(updateTime)) {
    text += ' (DST)';
  }
  return text;
});

// 数据处理
const dcPatches = computed(() => {
  const curDCName = validTabs.find((v) => v.query === curTab.value)?.name || '';
  const curDCData = data.value?.data?.find((v) => v.name === curDCName);
  const res = curDCData?.patches || null;
  return res;
});
</script>

<template>
  <div class="ffxiv">
    <div class="control">
      <div class="tabs">
        <ZButton
          v-for="tab of validTabs"
          :type="tab.query === curTab ? 'primary' : undefined"
          :key="tab.query"
          @click="handleSwitchTab(tab.query)"
        >
          {{ tab.name }}
        </ZButton>
      </div>
      <div class="update">{{ updateMessage }}</div>
      <div class="tz">
        <ZSelect
          class="tz__inner"
          name="timezone"
          v-model="curTZ"
          :options="tzdb"
        />
        <ZStale :stale="stale" />
      </div>
    </div>
    <ZLoading v-if="!dcPatches || !dcPatches.length" />
    <template v-else>
      <div class="content" v-for="patch of dcPatches" :key="patch.name">
        <table class="table">
          <thead>
            <tr>
              <th class="patch" colspan="5">{{ patch.name }}</th>
            </tr>
            <tr>
              <th>服务器</th>
              <th class="times">时间表</th>
              <th>始发地</th>
              <th>路线</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="server of patch.servers" :key="server.name">
              <td>{{ server.name }}</td>
              <td class="times">
                <TimeGrid :times="server.times || []" :tz="curTZ" />
              </td>
              <td>{{ server.start }}</td>
              <td>{{ server.route }}</td>
              <td>{{ server.comment }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <div class="notice">
      <ZList :list="infoList" v-slot="{ item }">
        <template v-if="(item.content as string)?.startsWith('http')">
          <ZExtLink type="primary" :href="(item.content as string)">
            {{ item.content }}
          </ZExtLink>
        </template>
        <template v-else>
          {{ item.content }}
        </template>
      </ZList>
    </div>
  </div>
</template>

<style scoped src="./FFXIV.scss"></style>
