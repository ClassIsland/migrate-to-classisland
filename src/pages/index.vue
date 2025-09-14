<template>
  <!-- Deprecation Warning -->
  <v-alert
    type="warning"
    variant="tonal"
    border="start"
    class="mb-6"
    closable
  >
    <v-alert-title class="text-h5 mb-3">
      ⚠️ 此迁移工具已废弃
    </v-alert-title>
    
    <div class="text-body-1 mb-4">
      <p class="mb-2">
        此迁移工具仅适配 <strong>ClassIsland v1</strong> 档案文件格式，已经不再适用于即将发布正式版的 <strong>ClassIsland v2</strong>。
      </p>
      <p class="mb-3">
        我们建议您直接使用最新版本的 ClassIsland，或访问官方网站获取最新信息。
      </p>
    </div>

    <div class="d-flex flex-column flex-sm-row gap-3">
      <v-btn
        color="primary"
        variant="elevated"
        :href="officialWebsite"
        target="_blank"
        size="large"
        prepend-icon="mdi-open-in-new"
      >
        访问 ClassIsland 官网
      </v-btn>
      
      <v-btn
        variant="outlined"
        size="large"
        @click="showLegacyContent = !showLegacyContent"
        :prepend-icon="showLegacyContent ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      >
        {{ showLegacyContent ? '隐藏' : '继续使用' }} v1 迁移工具
      </v-btn>
    </div>
  </v-alert>

  <!-- Original Content (Collapsible) -->
  <v-expand-transition>
    <div v-show="showLegacyContent">
      <v-divider class="mb-4"></v-divider>
      
      <div class="text-center mb-4">
        <p class="text-caption text-medium-emphasis">
          以下是原有的 ClassIsland v1 迁移功能，仅适用于旧版本档案格式
        </p>
      </div>

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
    </div>
  </v-expand-transition>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

// Reactive state for controlling the visibility of legacy content
const showLegacyContent = ref(false);

// Official ClassIsland website URL
const officialWebsite = 'https://classisland.tech/';

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

/* Ensure the alert has proper spacing and visibility */
.v-alert {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Make the deprecated content less prominent */
.v-expand-transition {
  opacity: 0.85;
}
</style>
