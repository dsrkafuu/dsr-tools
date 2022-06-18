<script setup lang="ts">
import type { BangumiAPIDataDay } from '.';
import { IFireAlt } from '../../icons';

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
          <a
            v-for="item of data.items"
            :key="item.id"
            class="item"
            :href="`//bgm.tv/subject/${item.id}`"
            target="_blank"
            rel="noopener"
          >
            <div class="image">
              <img
                v-if="item.image"
                :src="item.image"
                width="80"
                height="80"
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
          </a>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped src="./BangumiDay.scss"></style>
