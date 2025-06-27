<template>
  <v-container class="fill-height bg-background">
    <v-row class="align-center justify-center">
      <v-col cols="12" sm="11" md="10" lg="8" xl="6" class="pa-4">
        <div class="text-center mb-8">
          <h1 class="text-h2 font-weight-bold text-primary mb-3">語音摘要助手</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            將冗長的語音內容轉化為精簡的重點摘要。 透過 AI 智能分析，自動提取關鍵訊息，
            幫助您快速掌握音訊內容的核心重點。
          </p>
        </div>

        <v-card>
          <v-tabs v-model="tab" bg-color="indigo-darken-2" grow>
            <v-tab value="url" prepend-icon="mdi-link">從URL讀取</v-tab>
            <v-tab value="upload" prepend-icon="mdi-upload">上傳音檔</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab" class="tab-content">
              <v-window-item value="url">
                <v-form @submit.prevent="handleUrlSubmit">
                  <v-text-field
                    v-model="url"
                    label="請輸入音訊網址"
                    :disabled="loading"
                    class="my-6"
                    required
                  ></v-text-field>
                  <v-btn color="primary" :loading="loading" type="submit" block>開始</v-btn>
                </v-form>
              </v-window-item>
              <v-window-item value="upload">
                <AudioUploader @file-selected="summarizeTranscript" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <div v-if="loading" class="text-center mt-8 text-medium-emphasis">摘要生成中...</div>
        <div v-if="error" class="text-center mt-8 text-error">{{ error }}</div>
        <div v-if="transcript" class="mt-8">
          <h3 class="text-primary mb-3">摘要結果：</h3>
          <pre class="transcript-text">{{ transcript }}</pre>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tab = ref('url');
const url = ref('');
const transcript = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleUrlSubmit = async () => {
  if (!url.value) {
    error.value = '請輸入網址';
    return;
  }
  loading.value = true;
  error.value = '';
  transcript.value = '';
  try {
    const response = await fetch('/api/summarize-transcript/by-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl: url.value }),
    });
    console.log('response', response);

    if (!response.ok) throw new Error('伺服器錯誤');
    const data = await response.json();
    if (data.id) {
      router.push(`/files/${data.id}`);
      return;
    }
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

<style scoped>
.tab-content {
  min-height: 200px;
}
.transcript-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-top: 8px;
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.v-sheet) {
  width: 100%;
  background-color: #1e1e1e !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

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

:deep(.v-container) {
  max-width: 1600px;
}
</style>
