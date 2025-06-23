<template>
  <v-app-bar color="primary">
    <v-container class="px-4">
      <div class="d-flex align-center" style="height: 100%">
        <v-app-bar-title class="text-white font-weight-medium">語音摘要助手</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-tabs v-model="activeTab" color="white" align-tabs="center">
          <v-tab value="home" to="/" class="text-white px-4">首頁</v-tab>
          <v-tab value="files" to="/files" class="text-white px-4">內容列表</v-tab>
        </v-tabs>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = ref(route.path === '/' ? 'home' : 'files');
</script>

<style scoped>
:deep(.v-tab) {
  text-transform: none;
  font-size: 1rem;
  min-width: 100px;
  font-weight: 500;
}

:deep(.v-tab--selected) {
  font-weight: 700;
  opacity: 1;
}

:deep(.v-tabs) {
  height: 64px;
}

:deep(.v-container) {
  max-width: 1400px;
}
</style>
