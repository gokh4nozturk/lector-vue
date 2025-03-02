<!-- Page.vue -->
<template>
  <div
    :class="['lector-page', className]"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      marginBottom: `${spacing}px`,
    }"
    ref="pageRef"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed } from "vue";

interface Props {
  pageNumber: number;
  className?: string;
}

const props = defineProps<Props>();
const pageRef = ref<HTMLDivElement | null>(null);

// Inject dependencies from parent components
const pdfDocument = inject("pdfDocument");
const scale = inject("scale", ref(1));
const spacing = inject("spacing", ref(8));

// Page dimensions
const width = ref(0);
const height = ref(0);

// Load page and calculate dimensions
const loadPage = async () => {
  if (!pdfDocument.value) return;

  try {
    const page = await pdfDocument.value.getPage(props.pageNumber);
    const viewport = page.getViewport({ scale: scale.value });

    width.value = viewport.width;
    height.value = viewport.height;

    // Expose page object to child components
    defineExpose({
      page,
      viewport,
    });
  } catch (error) {
    console.error(`Error loading page ${props.pageNumber}:`, error);
  }
};

onMounted(() => {
  loadPage();
});
</script>

<style>
.lector-page {
  position: relative;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .lector-page {
    background: #2d2d2d;
  }
}
</style>
