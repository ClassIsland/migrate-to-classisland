<template>
  <h1 class="text-h3 text-sm-h3">欢迎使用ClassIsland迁移向导</h1>

  <br />

  <div v-for="(item, index) in migrateMethods" :key="index">
    <v-card
      :title="item.title"
      :subtitle="item.subtitle"
      :text="item.text"
      @click="router.push(item.path)"
      class="button-card"
    ></v-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
//

const migrateMethods = [
  {
    title: '从Electron Class Schedule迁移',
    subtitle: '核心来自HelloWRC',
    text: '可迁移内容：课表部分(最多只支持两周的轮换)',
    path: '/ecs'
  },
  {
    title: '从ZongziTEK黑板贴迁移',
    subtitle: '不支持单双周',
    text: '可迁移内容：所有',
    path: '/zztek'
  }
];
</script>

<style scoped>
.button-card {
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
