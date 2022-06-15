<template>
  <transition v-for="(item, idx) of messages" :key="item.id" name="message">
    <div
      v-if="item.show"
      :class="[
        'z-message',
        {
          'z-message--info': item.type === 'info',
          'z-message--success': item.type === 'success',
          'z-message--error': item.type === 'error',
        },
      ]"
      :style="{ bottom: `${22 + idx * 52}px` }"
    >
      <div class="z-message__type">
        <ICheckCircle v-if="item.type === 'success'" />
        <IExclamationCircle v-else-if="item.type === 'error'" />
        <IInfoCircle v-else />
      </div>
      <div class="z-message__content">{{ item.text }}</div>
      <div class="z-message__close" @click="close && close(item.id)">
        <ZButton>
          <template #icon>
            <ITimes />
          </template>
        </ZButton>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { ZMessageItem } from './index';
import { Ref, inject } from 'vue';
import {
  IInfoCircle,
  ICheckCircle,
  IExclamationCircle,
  ITimes,
} from '../../icons';
import ZButton from '../ZButton.vue';

const messages = inject<Ref<ZMessageItem[]>>('messages');
const close = inject<(mid: number) => void>('close');
</script>

<style lang="scss" src="./ZMessage.scss"></style>
