<script setup lang="ts">
import type { BangumiAPIDataDay } from './types';
import { IFireAlt } from '../../icons';
import { ZExtLink } from '../../components';

interface BangumiDayProps {
  data: BangumiAPIDataDay | null;
}
defineProps<BangumiDayProps>();

const formatHot = (hot = 0) => {
  return `${hot}`;
};
</script>

<template>
  <template v-if="!data">
    <div class="day"></div>
  </template>
  <template v-else>
    <div class="day">
      <div class="card">
        <div class="title">{{ data.weekday }}</div>
        <div class="list">
          <ZExtLink
            v-for="item of data.items"
            class="item"
            :key="item.id"
            :href="`//bgm.tv/subject/${item.id}`"
          >
            <div class="image">
              <img
                v-if="item.image"
                :src="item.image"
                width="80"
                height="80"
                loading="lazy"
                referrerpolicy="no-referrer"
              />
            </div>
            <div class="meta">
              <h3 class="name">{{ item.rname }}</h3>
              <span v-if="item.tname" class="trans">
                {{ item.tname }}
              </span>
              <div class="score">
                <div class="rating">
                  <div class="rating__bar">
                    <div
                      class="rating__inner"
                      :style="{
                        width: `${Math.round(
                          ((item.rating || 0) / 10) * 100
                        )}%`,
                      }"
                    ></div>
                  </div>
                  {{
                    typeof item.rating === 'number' && item.rating
                      ? item.rating.toFixed(1)
                      : '-.-'
                  }}
                </div>
                <div class="hot">
                  {{ formatHot(item.hot) }}
                  <IFireAlt />
                </div>
              </div>
            </div>
          </ZExtLink>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped src="./BangumiDay.scss"></style>
