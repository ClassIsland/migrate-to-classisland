<template>
  <h1 class="text-h3 text-sm-h3">从Electron Class Schedule迁移</h1>

  <v-file-input
    v-model="file"
    label="上传配置文件"
    @multiple="false"
    @change="loadFile()"
  ></v-file-input>
  <br />

  <v-btn v-if="isFileLoaded" @click="convert()">开始转换</v-btn>
</template>

<script lang="ts" setup>
import { convertEcsToClassIsland } from "../core/ecs/converting";
import { ref } from "vue";
import { loadEcsSchedule } from "../core/ecs/ecsLoader";
import { saveClassIslandProfile } from "../core/classIslandLoader";

const file = ref(null);
const fileContent = ref("");
const isConverted = ref(false);
const isFileLoaded = ref(false);
const convertingError = ref(null);

function loadFile() {
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
    const jsonStr = (json instanceof Object) ? JSON.stringify(json, null, 4) : json;

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
      new Blob([saveClassIslandProfile(ci)], { type: "application/json" })
    );

    console.log("下载链接：", saveUrl);
    downloadJson("ProfileECS.json", saveClassIslandProfile(ci));
  } catch (error) {
    convertingError.value = error as Error;
    isConverted.value = false;
  }
}
</script>
