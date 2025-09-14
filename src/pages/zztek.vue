<template>
  <!-- Deprecation Warning -->
  <v-alert
    type="warning"
    variant="tonal"
    border="start"
    class="mb-6"
    closable
  >
    <v-alert-title class="text-h6 mb-2">
      ⚠️ 此迁移工具已废弃
    </v-alert-title>
    
    <div class="text-body-2 mb-3">
      <p class="mb-1">
        此工具仅适配 <strong>ClassIsland v1</strong>，已不再适用于 <strong>ClassIsland v2</strong>。
      </p>
    </div>

    <div class="d-flex flex-column flex-sm-row gap-2">
      <v-btn
        color="primary"
        variant="text"
        href="https://classisland.tech/"
        target="_blank"
        size="small"
        prepend-icon="mdi-open-in-new"
      >
        访问 ClassIsland 官网
      </v-btn>
      
      <v-btn
        variant="text"
        size="small"
        @click="$router.push('/')"
        prepend-icon="mdi-arrow-left"
      >
        返回首页
      </v-btn>
    </div>
  </v-alert>

  <h1 class="text-h3 text-sm-h3">从ZongziTEK黑板贴迁移</h1>

  <br />

  <v-stepper :items="['说明', '上传黑板贴配置', '转换']">
    <template v-slot:item.1>
      <v-card flat>
        <v-card-item>
          <v-card-title>转换说明</v-card-title>
        </v-card-item>

        <v-card-text>
          本转换向导将提供将ZongziTEK黑板贴带有时间信息的课程表 转换为ClassIsland档案文件的服务。
          <br />
          上传您的ZongziTEK黑板贴带时间课表文件 (JSON)，然后点击开始转换。
          <br />
          转换完成后，ClassIsland档案文件将会自动下载，您可以将其导入到ClassIsland中
          (直接放入Profiles文件夹)。
        </v-card-text>
      </v-card>
    </template>

    <template v-slot:item.2>
      <v-card flat>
        <v-card-item>
          <v-card-title>上传黑板贴课程表</v-card-title>
        </v-card-item>

        <v-card-text>
          请上传您的ZongziTEK黑板贴带时间课表文件
          (Timetable.json)。它通常位于ZongziTEK黑板贴的根目录。
          <br />
          <br />
          <v-file-input
            v-model="file"
            accept="application/json"
            label="上传配置文件"
            @multiple="false"
            @change="loadFile()"
          ></v-file-input>
        </v-card-text>
      </v-card>
    </template>

    <template v-slot:item.3>
      <v-card flat>
        <v-card-item>
          <v-card-title>转换</v-card-title>
        </v-card-item>

        <v-card-text>
          确认上传文件无误后，请点击“开始转换”。

          <br />
          <br />
          <v-btn v-show="isFileLoaded" @click="convert()">开始转换</v-btn>

          <br />
          <br />

          <v-expand-transition>
            <v-alert
              v-show="isConverted"
              title="转换完成"
              text="ClassIsland档案文件将会自动下载，您可以将其导入到ClassIsland中(直接放入Profiles文件夹)。"
              type="success"
            ></v-alert>
          </v-expand-transition>
          <v-expand-transition>
            <v-alert
              v-show="!isFileLoaded"
              title="请先上传文件"
              text="请先上传您的黑板贴带时间课表文件 (Timetable.json)。"
              type="warning"
            ></v-alert>
          </v-expand-transition>
          <v-expand-transition>
            <v-alert
              v-show="convertingError"
              title="转换失败"
              :text="'转换过程中发生错误，请检查您的配置文件。' + convertingError"
              type="error"
            ></v-alert>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </template>
  </v-stepper>
</template>

<script lang="ts" setup>
import { convertZongziTEKToClassIsland } from '../core/zztek/converting';
import { ref } from 'vue';
import { loadZongziTEKSchedule } from '../core/zztek/zztekLoader';
import { saveClassIslandProfile } from '../core/classIslandLoader';

const file = ref(null);
const fileContent = ref('');
const isConverted = ref(false);
const isFileLoaded = ref(false);
const convertingError = ref(null);

function loadFile() {
  isConverted.value = false;
  convertingError.value = null;
  // console.log(file.value);
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (event) => {
      fileContent.value = event.target?.result as string;
    };
    reader.readAsText(file.value);
  }
  isFileLoaded.value = true;
}

function downloadJson(fileName, json) {
  const jsonStr = json instanceof Object ? JSON.stringify(json, null, 4) : json;

  const url = window.URL || window.webkitURL || window;
  const blob = new Blob([jsonStr]);
  const saveLink = document.createElement('a');
  saveLink.href = url.createObjectURL(blob);
  saveLink.download = fileName;
  saveLink.click();
}

function convert() {
  try {
    const r = loadZongziTEKSchedule(fileContent.value);
    const ci = convertZongziTEKToClassIsland(r);
    console.log(ci);
    isConverted.value = true;
    const saveUrl = URL.createObjectURL(
      new Blob([saveClassIslandProfile(ci)], { type: 'application/json' })
    );

    console.log('下载链接：', saveUrl);
    downloadJson('ProfileZZTEK.json', saveClassIslandProfile(ci));
  } catch (error) {
    convertingError.value = error as Error;
    isConverted.value = false;
  }
}
</script>
