<!-- Toolbar.vue -->
<template>
  <div :class="['lector-toolbar', className]">
    <div class="zoom-controls">
      <button @click="zoomOut" class="toolbar-button" title="Uzaklaştır">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>

      <select v-model="currentScale" class="scale-select" @change="updateScale">
        <option
          v-for="option in scaleOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <button @click="zoomIn" class="toolbar-button" title="Yakınlaştır">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

interface Props {
  className?: string;
}

const props = defineProps<Props>();
const scale = inject("scale", ref(1));

const scaleOptions = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
  { value: 2, label: "200%" },
];

const currentScale = ref(1);

const updateScale = () => {
  scale.value = currentScale.value;
};

const zoomIn = () => {
  const currentIndex = scaleOptions.findIndex(
    (option) => option.value === currentScale.value
  );
  if (currentIndex < scaleOptions.length - 1) {
    currentScale.value = scaleOptions[currentIndex + 1].value;
    updateScale();
  }
};

const zoomOut = () => {
  const currentIndex = scaleOptions.findIndex(
    (option) => option.value === currentScale.value
  );
  if (currentIndex > 0) {
    currentScale.value = scaleOptions[currentIndex - 1].value;
    updateScale();
  }
};
</script>

<style>
.lector-toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #f8fafc;
  color: #475569;
}

.scale-select {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .lector-toolbar {
    background: #1a1a1a;
    border-color: #2d2d2d;
  }

  .toolbar-button {
    background: #1a1a1a;
    border-color: #2d2d2d;
    color: #94a3b8;
  }

  .toolbar-button:hover {
    background: #2d2d2d;
    color: #e2e8f0;
  }

  .scale-select {
    background: #1a1a1a;
    border-color: #2d2d2d;
    color: #94a3b8;
  }
}
</style>
