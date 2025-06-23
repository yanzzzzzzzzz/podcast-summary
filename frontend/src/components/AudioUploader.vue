<template>
  <div
    class="audio-uploader"
    :class="{ 'is-dragover': isDragOver }"
    @click="onClick"
    @dragleave.prevent="onDragLeave"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      accept=".mp3,audio/mp3,audio/mpeg"
      style="display: none"
      type="file"
      @change="onFileChange"
    />
    <slot>
      <div class="uploader-content">
        <span v-if="!fileName">拖拉或點擊這裡上傳 .mp3 檔案</span>
        <span v-else>已選擇檔案：{{ fileName }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const fileName = ref<string | null>(null);

const emit = defineEmits<{
  (e: 'file-selected', file: File): void;
}>();

function onClick() {
  fileInput.value?.click();
}

function onDragOver() {
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

function onDrop(e: DragEvent) {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0]);
  }
}

function handleFile(file: File) {
  if (file.type === 'audio/mp3' || file.type === 'audio/mpeg' || file.name.endsWith('.mp3')) {
    fileName.value = file.name;
    emit('file-selected', file);
  } else {
    alert('請選擇 .mp3 檔案');
  }
}
</script>

<style scoped>
.audio-uploader {
  border: 2px dashed #aaa;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.audio-uploader.is-dragover {
  border-color: #1976d2;
  background: #f0f8ff;
}
.uploader-content {
  font-size: 16px;
  color: #555;
}
</style>
