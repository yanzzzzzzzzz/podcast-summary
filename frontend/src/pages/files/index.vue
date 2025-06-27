<template>
  <v-container class="fill-height bg-background">
    <v-row class="align-center justify-center">
      <v-col cols="12" sm="11" md="10" lg="8" xl="6" class="pa-4">
        <div class="text-center mb-8">
          <h1 class="text-h2 font-weight-bold text-primary mb-3">內容列表</h1>
          <p class="text-subtitle-1 text-medium-emphasis">查看所有已上傳的音訊檔案及其摘要內容</p>
        </div>
        <v-sheet class="pa-6 bg-surface-variant" rounded elevation="5">
          <v-table v-if="uploadedFiles.length > 0">
            <thead>
              <tr>
                <th class="text-left">上傳日期</th>
                <th class="text-left">檔案名稱</th>
                <th class="text-left">音訊長度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in uploadedFiles" :key="file.id">
                <td>{{ file.uploadDate }}</td>
                <td>
                  <router-link :to="`/files/${file.id}`">
                    {{ file.fileName }}
                  </router-link>
                </td>
                <td>{{ file.duration }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-medium-emphasis">目前尚無上傳紀錄</div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { UploadedFile } from '../../models/UploadedFile';
const uploadedFiles = ref<Array<UploadedFile>>([]);

const fetchUploadedFiles = async () => {
  try {
    const res = await fetch('/api/summarize-transcript');
    if (!res.ok) throw new Error('無法取得上傳紀錄');
    const data = await res.json();
    uploadedFiles.value = data;
    console.log('uploadedFiles.length', uploadedFiles.value.length);
  } catch (e) {
    uploadedFiles.value = [];
  }
};

onMounted(() => {
  fetchUploadedFiles();
});
</script>

<style scoped>
.text-h2 {
  background: linear-gradient(45deg, #7895ff, #6b8aff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 1px;
}

.text-subtitle-1 {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

:deep(.v-sheet) {
  width: 100%;
  background-color: #1e1e1e !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
