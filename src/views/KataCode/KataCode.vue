<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { IChevronRight, IChevronLeft, ITrash } from '../../icons';
import { decodeKata, encodeKata } from '../../utils/katacode';
import { log } from '../../utils/logger';
import ZButton from '../../components/ZButton.vue';
import ZTextArea from '../../components/ZTextArea.vue';
import ZList from '../../components/ZList.vue';
import ZMessage from '../../components/ZMessage';
import { isPC } from '../../utils/env';
import { throttle } from 'dsr-design/utils';

const info = [
  {
    title: '密文格式',
    content: '请注意相同的明文可能会产生不同的密文',
  },
  {
    title: '数据支持',
    content: '支持任意 Unicode 字符',
  },
  {
    title: '免责声明',
    content: '本站不对使用此工具造成的任何结果负相关法律责任',
  },
];

const srcStr = ref('');
const encStr = ref('');

const handleClear = () => {
  srcStr.value = '';
  encStr.value = '';
  ZMessage.info('已清空内容');
};
const handleEncode = async () => {
  try {
    const res = await encodeKata(srcStr.value);
    if (res) {
      encStr.value =
        res +
        `\n${new Array(40).fill('-').join('')}\n` +
        window.location.origin +
        window.location.pathname;
      log('katacode encoded');
      ZMessage.success('已生成密文');
    }
  } catch {
    ZMessage.error('生成密文失败 请检查输入字符');
  }
};
const handleDecode = async () => {
  try {
    const res = await decodeKata(encStr.value);
    if (res) {
      srcStr.value = res;
      log('katacode decoded');
      ZMessage.success('解密成功');
    }
  } catch {
    ZMessage.error('解密失败 请检查输入字符');
  }
};

// PC 展示宽信息
const inline = ref(isPC());
// 响应缩放
const handleResize = throttle(() => {
  inline.value = isPC();
});
window.addEventListener('resize', handleResize);
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="katacode">
    <div class="main">
      <div class="card card--input">
        <ZTextArea class="input" v-model="srcStr" />
      </div>
      <div class="control">
        <ZButton class="control__btn" type="primary" @click="handleEncode">
          <template #icon><IChevronRight /></template>
          加密
        </ZButton>
        <ZButton class="control__btn" type="primary" @click="handleDecode">
          <template #icon><IChevronLeft /></template>
          解密
        </ZButton>
        <ZButton class="control__btn" type="danger" @click="handleClear">
          <template #icon><ITrash /></template>
          清空
        </ZButton>
      </div>
      <div class="card card--input">
        <ZTextArea class="input" v-model="encStr" />
      </div>
    </div>
    <div class="notice">
      <div class="card">
        <ZList :list="info" :inline="inline" />
      </div>
    </div>
  </div>
</template>

<style scoped src="./KataCode.scss"></style>
