<template>
  <v-container class="fill-height bg-background">
    <v-row v-if="file" class="align-center justify-center">
      <v-col cols="12" sm="11" md="10" lg="8" xl="6">
        <v-card class="pa-4" elevation="5">
          <div
            v-if="file.logoUrl || file.showName || file.category || file.audioUrl"
            class="mb-4 d-flex align-center"
          >
            <v-avatar v-if="file.logoUrl" size="64" class="mr-4">
              <v-img :src="file.logoUrl" :alt="file.showName"></v-img>
            </v-avatar>
            <div>
              <div v-if="file.showName" class="text-h6 font-weight-bold mb-1">
                {{ file.showName }}
              </div>
              <v-chip v-if="file.category" color="primary" size="small" class="mb-1">{{
                file.category
              }}</v-chip>
              <div v-if="file.audioUrl">
                <a
                  :href="file.audioUrl"
                  target="_blank"
                  rel="noopener"
                  class="text-primary text-caption"
                >
                  <v-icon size="16" class="mr-1">mdi-link-variant</v-icon>音訊來源
                </a>
              </div>
            </div>
          </div>
          <v-card-title class="text-h4 font-weight-bold text-primary mb-4">
            {{ file.fileName }}
          </v-card-title>
          <v-card-subtitle class="text-medium-emphasis mb-4">
            上傳於 {{ new Date(file.uploadDate).toLocaleString() }}
          </v-card-subtitle>

          <v-divider class="my-4"></v-divider>

          <v-card-text>
            <p class="text-h6 font-weight-medium">摘要</p>
            <p
              class="text-body-1 text-medium-emphasis mt-2"
              style="white-space: pre-wrap; line-height: 1.8"
            >
              {{ file.summary }}
            </p>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-chip color="primary" label>
              <v-icon start icon="mdi-clock-outline"></v-icon>
              時長: {{ file.duration != null ? formatDuration(Number(file.duration)) : '-' }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" to="/files">返回列表</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else-if="loading" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <v-row v-else class="align-center justify-center">
      <v-col cols="auto">
        <p class="text-h6 text-medium-emphasis">找不到檔案</p>
        <v-btn color="primary" variant="text" to="/files" class="mt-4">返回列表</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { UploadedFile } from '@/models/UploadedFile';
import { formatDuration } from '@/utils/formatDuration';

const route = useRoute();
const file = ref<UploadedFile | null>(null);
const loading = ref(true);

const fetchFileDetails = async () => {
  try {
    const id = (route.params as { id?: string }).id;
    if (!id) throw new Error('無效的ID');
    const res = await fetch(`/api/summarize-transcript/${id}`);
    if (!res.ok) {
      throw new Error('無法取得檔案詳細資訊');
    }
    file.value = await res.json();
  } catch (e) {
    file.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchFileDetails();
});
</script>

<style scoped>
.v-card {
  background-color: #1e1e1e !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
