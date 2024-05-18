<template>
  <h1 class="text-h3 text-sm-h3">欢迎使用ClassIsland迁移向导</h1>

  <br />

  <div v-for="(item, index) in migrateMethods" :key="index">
    <v-card
      :title="item.title"
      :subtitle="item.subtitle"
      :text="item.text"
      @click="this.$router.push(item.path);"
    ></v-card>
  </div>
</template>

<script lang="ts" setup>
//

const migrateMethods = [
  {
    title: "从Electron Class Schedule迁移",
    subtitle: "核心来自HelloWRC",
    text: "可迁移内容：所有",
    path: "/ecs"
  },
];


</script>
