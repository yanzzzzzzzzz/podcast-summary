<template>
  <AudioUploader @file-selected="summarizeTranscript" />
  <div v-if="loading">摘要生成中...</div>
  <div v-if="error" style="color:red">{{ error }}</div>
  <div v-if="transcript">
    <h3>摘要結果：</h3>
    <pre>{{ transcript }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const transcript = ref('');
const loading = ref(false);
const error = ref('');

const summarizeTranscript = async (file: File) => {
  loading.value = true;
  error.value = '';
  transcript.value = '';
  try {
    const formData = new FormData();
    formData.append('audio', file);
    const response = await fetch('/api/summarize-transcript', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('伺服器錯誤');
    const data = await response.json();
    if (data.transcript) {
      transcript.value = data.transcript;
    } else {
      error.value = data.message || '未知錯誤';
    }
  } catch (e: any) {
    error.value = e.message || '請求失敗';
  } finally {
    loading.value = false;
  }
};
</script>
