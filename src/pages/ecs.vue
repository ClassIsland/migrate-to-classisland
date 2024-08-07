<template>
  <h1 class="text-h3 text-sm-h3">从Electron Class Schedule迁移</h1>

  <br />

  <v-stepper :items="['说明', '上传ECS配置', '转换']">
    <template v-slot:item.1>
      <v-card flat>
        <v-card-item>
          <v-card-title>转换说明</v-card-title>
        </v-card-item>

        <v-card-text>
          本转换向导将提供将Electron Class Schedule基于JS的配置文件 (scheduleConfig.js)
          转换为ClassIsland档案文件的服务。
          <br />
          上传您的ECS配置文件 (基于JS)，然后点击开始转换。
          <br />
          转换完成后，ClassIsland档案文件将会自动下载，您可以将其导入到ClassIsland中
          (直接放入Profiles文件夹)。
        </v-card-text>
      </v-card>
    </template>

    <template v-slot:item.2>
      <v-card flat>
        <v-card-item>
          <v-card-title>上传ECS配置</v-card-title>
        </v-card-item>

        <v-card-text>
          请上传您的ECS配置文件 (scheduleConfig.js)。
          <br />
          <br />
          <v-file-input
            v-model="file"
            accept="text/javascript"
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
              text="请先上传您的ECS配置文件 (scheduleConfig.js)。"
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
import { convertEcsToClassIsland } from '../core/ecs/converting';
import { ref } from 'vue';
import { loadEcsSchedule } from '../core/ecs/ecsLoader';
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
    const r = loadEcsSchedule(fileContent.value);
    const ci = convertEcsToClassIsland(r);
    console.log(ci);
    isConverted.value = true;
    const saveUrl = URL.createObjectURL(
      new Blob([saveClassIslandProfile(ci)], { type: 'application/json' })
    );

    console.log('下载链接：', saveUrl);
    downloadJson('ProfileECS.json', saveClassIslandProfile(ci));
  } catch (error) {
    convertingError.value = error as Error;
    isConverted.value = false;
  }
}
</script>
