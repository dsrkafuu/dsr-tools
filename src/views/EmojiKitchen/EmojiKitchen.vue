<script setup lang="ts">
import type { EmojiCombo, EmojiOutData } from './types';
import { computed, nextTick, ref } from 'vue';
import { useSWR } from '../../hooks';
import { ZButton, ZStale, ZLoading } from '../../components';
import { isMobile } from '../../utils/env';

const { stale: supStale, data: supData } = useSWR<string[]>(
  'https://cdn.dsrkafuu.net/json/emoji/support.min.json'
);
const support = computed(() => {
  return (supData.value || []).map((code) => {
    const codePoint = code
      .split('-')
      .filter((x) => x !== 'fe0f')
      .join('_');
    return {
      id: code,
      url:
        `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/128/emoji_u` +
        `${codePoint}.png`,
    };
  });
});
const { stale: outStale, data: outData } = useSWR<EmojiOutData>(
  'https://cdn.dsrkafuu.net/json/emoji/output.min.json'
);
const output = computed(() => outData.value || {});

const left = ref('');
const right = ref('');

/**
 * find the pairs where the emoji we're on is either on the left or right side of the combinations for this emoji,
 * https://github.com/xsalazar/emoji-kitchen/blob/d72c7effa3/src/Components/kitchen.tsx#L302
 */
const isValidCombo = (left: string, right: string) => {
  return (output.value[left] || []).some((c) => {
    // if we're on the double emoji combo, both sides need to be equal to be valid
    if (right === left) {
      return right === c.l && right === c.r;
    }
    // otherwise, being on either side is valid
    return right === c.l || right === c.r;
  });
};

// 列表过滤
// https://github.com/xsalazar/emoji-kitchen/blob/main/src/Components/kitchen.tsx#L58
const leftList = computed(() => {
  return support.value.map((item) => {
    return { ...item, selected: left.value === item.id };
  });
});
const rightList = computed(() => {
  return support.value.map((item) => {
    let valid = false;
    if (left.value) {
      valid = isValidCombo(left.value, item.id);
    }
    return { ...item, selected: right.value === item.id, valid };
  });
});

/**
 * 提供容器和选择的 Emoji key，自动滚动到指定位置
 */
const autoScroll = (container: 'left' | 'right' | 'output', emoji: string) => {
  nextTick(() => {
    const parent = document.querySelector(
      `#container_${container}`
    ) as HTMLElement | null;
    const child = document.querySelector(
      `#emoji_${container}_${emoji}`
    ) as HTMLElement | null;
    if (!parent || !child) {
      return;
    }
    if (isMobile()) {
      // horizontal scroll
      const childOffset = child.offsetLeft;
      const targetScroll = childOffset - 16 - 54; // -16 for padding, -54 for one col
      parent.scrollLeft = targetScroll;
    } else {
      // vertical scroll
      const childOffset = child.offsetTop;
      const targetScroll = childOffset - 16 - 62; // -16 for padding, -62 for one row
      parent.scrollTop = targetScroll;
    }
  });
};

const handleLeftSelect = (id: string) => {
  if (id === left.value) {
    right.value = '';
    left.value = '';
  } else {
    if (!isValidCombo(id, right.value)) {
      right.value = '';
    }
    left.value = id;
  }
};
const handleRightSelect = (id: string) => {
  if (id === right.value) {
    right.value = '';
  } else {
    right.value = id;
  }
};
const handleOutSelect = (key: string) => {
  const anothers = key
    .split('_')
    .filter((x) => x !== left.value && x !== right.value);
  if (anothers.length) {
    right.value = anothers[0];
  } else {
    right.value = left.value;
  }
  autoScroll('right', right.value);
};
const handleRandom = () => {
  const randLeft = Math.floor(Math.random() * leftList.value.length);
  left.value = leftList.value[randLeft].id;
  const tempRightList: string[] = [];
  support.value.forEach((item) => {
    const valid = isValidCombo(left.value, item.id);
    valid && tempRightList.push(item.id);
  });
  const randRight = Math.floor(Math.random() * tempRightList.length);
  right.value = tempRightList[randRight];
  autoScroll('right', right.value);
  autoScroll('left', left.value);
};
const handleClear = () => {
  right.value = '';
  left.value = '';
};

// 输出生成
// https://github.com/xsalazar/emoji-kitchen/blob/main/src/Components/kitchen.tsx#L252
const emojiPart = (emoji: string) => {
  return emoji
    .split('-')
    .map((part: string) => `u${part.toLowerCase()}`)
    .join('-');
};
const emojiFile = (combo: EmojiCombo) => {
  return `${emojiPart(combo.l)}_${emojiPart(combo.r)}.png`;
};
const outList = computed(() => {
  const base = 'https://www.gstatic.com/android/keyboard/emojikitchen';
  if (left.value && right.value) {
    let combo =
      output.value[left.value]?.filter(
        (c) => c.l === left.value && c.r === right.value
      )[0] ??
      output.value[left.value]?.filter(
        (c) => c.l === right.value && c.r === left.value
      )[0];
    combo = combo || { l: '', r: '', t: '' };
    return [
      {
        key: `${combo.l}_${combo.r}`,
        url: base + `/${combo.t}/${emojiPart(combo.l)}/${emojiFile(combo)}`,
      },
    ];
  } else if (left.value) {
    const data = output.value[left.value] || [];
    return data.map((item) => {
      return {
        key: `${item.l}_${item.r}`,
        url: base + `/${item.t}/${emojiPart(item.l)}/${emojiFile(item)}`,
      };
    });
  } else {
    return [];
  }
});
</script>

<template>
  <div class="emojikitchen">
    <div class="control">
      <div class="btns">
        <ZButton type="primary" @click="handleRandom">随机</ZButton>
        <ZButton
          type="danger"
          :disabled="!(left || right)"
          @click="handleClear"
        >
          清空
        </ZButton>
      </div>
      <ZStale :stale="outStale || supStale" />
    </div>
    <ZLoading v-if="!support.length || !Object.keys(output).length" />
    <div v-else class="ekapp">
      <div class="selector" id="container_left">
        <div
          :class="[
            'selector__item',
            { 'selector__item--selected': item.selected },
          ]"
          v-for="item of leftList"
          :key="item.id"
          @click="handleLeftSelect(item.id)"
          :id="`emoji_left_${item.id}`"
        >
          <img width="128" height="128" loading="lazy" :src="item.url" />
        </div>
      </div>
      <div class="selector" id="container_right">
        <div
          :class="[
            'selector__item',
            { 'selector__item--selected': item.selected },
            { 'selector__item--disabled': !item.valid },
          ]"
          v-for="item of rightList"
          :key="item.id"
          @click="item.valid && handleRightSelect(item.id)"
          :id="`emoji_right_${item.id}`"
        >
          <img width="128" height="128" loading="lazy" :src="item.url" />
        </div>
      </div>
      <div
        :class="[
          'output',
          {
            'output--list': outList.length > 1,
            'output--single': outList.length === 1,
            'output--none': outList.length < 1,
          },
        ]"
        id="container_output"
      >
        <template v-if="outList.length > 1">
          <div
            class="output__item"
            v-for="item of outList"
            :key="item.key"
            @click="handleOutSelect(item.key)"
            :id="`emoji_output_${item.key}`"
          >
            <img width="534" height="534" loading="lazy" :src="item.url" />
          </div>
        </template>
        <template v-else-if="outList.length === 1">
          <img width="534" height="534" loading="lazy" :src="outList[0].url" />
        </template>
        <template v-else>请选择 Emoji 输入</template>
      </div>
    </div>
  </div>
</template>

<style scoped src="./EmojiKitchen.scss"></style>
