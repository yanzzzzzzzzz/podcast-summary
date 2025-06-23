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
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  max-height: 300px;
  min-width: 300px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
}

.audio-uploader:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.audio-uploader.is-dragover {
  border-color: #7895FF;
  background: rgba(120, 149, 255, 0.1);
}

.uploader-content {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.87);
  width: 100%;
}
</style>
