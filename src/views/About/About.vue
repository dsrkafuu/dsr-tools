<script setup lang="ts">
import pkg from '../../../package.json';
import ZButton from '../../components/ZButton.vue';
import ZList from '../../components/ZList.vue';

const licenseList = [
  {
    title: 'Minecraft',
    content: [
      'Minecraft is a registered trademark of Mojang Synergies AB.',
      '以任何方式散布修改版 Minecraft 客户端的行为本身违反《Minecraft最终用户许可协议》，且整合包本身也具有安全隐患问题。',
      '本网站对于整合包对您的计算机造成的一切后果概不负责，且对本页面的一切内容随时保留应 Mojang AB、微软公司或 Mod 作者的要求采取删除等行为的权力。',
    ],
  },
  {
    title: 'FINAL FANTASY XIV',
    content: [
      `© 2010 - ${new Date().getFullYear()} SQUARE ENIX CO., LTD. All Rights Reserved.`,
      'FINAL FANTASY, FINAL FANTASY XIV, FFXIV, SQUARE ENIX, and the SQUARE ENIX logo are registered trademarks or trademarks of Square Enix Holdings Co., Ltd.',
      'ENDWALKER, SHADOWBRINGERS, STORMBLOOD, HEAVENSWARD, and A REALM REBORN are registered trademarks or trademarks of Square Enix Co., Ltd.',
      '上海数龙科技有限公司版权所有',
    ],
  },
];

const dependencies = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
};
const depsList = (
  Object.keys(dependencies) as Array<keyof typeof dependencies>
).map((dep) => {
  return {
    title: dep,
    content: dependencies[dep],
  };
});
</script>

<template>
  <div class="about">
    <div class="left">
      <div class="image">
        <img
          src="https://cdn.dsrkafuu.net/opengraph/dsrkafuu.png"
          loading="lazy"
        />
      </div>
      <div class="info">
        <ZButton type="primary" class="info__btn" href="https://dsrkafuu.net">
          主页
        </ZButton>
        <ZButton
          type="primary"
          class="info__btn"
          href="https://blog.dsrkafuu.net"
        >
          博客
        </ZButton>
        <ZButton
          type="primary"
          class="info__btn"
          href="https://design.dsrkafuu.net"
        >
          设计
        </ZButton>
      </div>
      <div class="card">
        <ZList :list="licenseList" v-slot="{ item }">
          <p
            class="license__para"
            v-for="para of item.content"
            :key="(para as string).slice(0, 8)"
          >
            {{ para }}
          </p>
        </ZList>
      </div>
    </div>
    <div class="right">
      <div class="card">
        <ZList :list="depsList" inline />
      </div>
    </div>
  </div>
</template>

<style scoped src="./About.scss"></style>
