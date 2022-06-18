<script setup lang="ts">
import type { MCData } from './types';
import { computed } from 'vue';
import dayjs from '../../utils/dayjs';
import { useSWR } from '../../hooks';
import { ICurseForge, IModrinth } from '../../icons';
import { ZButton, ZExtLink, ZList, ZLoading, ZStale } from '../../components';

// 拉取数据
const { stale, data } = useSWR<MCData | null>(
  'https://cdn.dsrkafuu.net/json/dsrvmc.min.json'
);

const release = computed(() => {
  return dayjs(data.value?.time || 0).format('YYYY-MM-DD');
});
const version = computed(() => {
  return `${data.value?.release} (${data.value?.version})`;
});

const infoList = [
  { content: 'Java 下载请至 "相关链接" 部分查看' },
  { content: '所有游戏帐户将自动保存在本地注册表中' },
  { content: '如对启动器或游戏有其他疑问请查看帮助页面' },
];

const modList = computed(() => {
  return (
    data.value?.mods.map((item) => {
      return {
        title: item.name,
        content: item.source === 0 ? 'Modrinth' : 'CurseForge',
        link: item.link,
      };
    }) || []
  );
});
</script>

<template>
  <div class="minecraft">
    <ZLoading v-if="!data" />
    <template v-else>
      <div class="left">
        <div class="card">
          <div class="image">
            <img src="/images/minecraft.jpg" loading="lazy" />
          </div>
          <div class="download">
            <div class="markdown">
              <ZStale :stale="stale" />
              {{ release }}&nbsp;|&nbsp;<code>{{ version }}</code>
            </div>
            <ZButton type="primary" :href="data?.package"> 下载整合包 </ZButton>
          </div>
        </div>
        <div class="card">
          <div class="card__title">关于整合</div>
          <div class="card__content">
            <ZList :list="infoList" />
          </div>
        </div>
        <div class="card">
          <div class="card__title">相关链接</div>
          <div class="card__btns">
            <ZButton class="card__btn" type="primary" :href="data?.modrinth">
              Modrinth
            </ZButton>
            <ZButton class="card__btn" type="primary" :href="data?.java">
              Java 下载
            </ZButton>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="card">
          <div class="card__title">版本信息</div>
          <ZList class="card__mod" :list="modList" v-slot="{ item }" inline>
            <ZExtLink
              class="mod__item"
              type="primary"
              :href="(item.link as string)"
            >
              <template v-if="item.content === 'Modrinth'">
                <IModrinth v-if="item.content === 'Modrinth'" />
              </template>
              <template v-else>
                <ICurseForge />&nbsp;
                <span>{{ item.content }}</span>
              </template>
            </ZExtLink>
          </ZList>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped src="./Minecraft.scss"></style>
