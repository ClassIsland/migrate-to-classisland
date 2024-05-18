<template>
  <v-app>
    <AppTopBar />
    <v-main>
      <v-container class="pa-4 pa-sm-6 pa-md-8" style="max-width: 960px;">
        <router-view />
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
