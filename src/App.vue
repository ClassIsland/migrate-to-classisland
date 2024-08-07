<template>
  <v-app>
    <v-main>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss"></style>
