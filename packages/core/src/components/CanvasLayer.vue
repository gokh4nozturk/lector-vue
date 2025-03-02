<!-- CanvasLayer.vue -->
<template>
  <canvas :class="['lector-canvas-layer', className]" ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch } from "vue";

interface Props {
  className?: string;
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Inject dependencies from parent components
const page = inject("page");
const viewport = inject("viewport");
const scale = inject("scale", ref(1));

// Render page on canvas
const renderPage = async () => {
  if (!page.value || !viewport.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");

  if (!context) return;

  // Set canvas dimensions
  canvas.width = viewport.value.width;
  canvas.height = viewport.value.height;

  // Render PDF page
  const renderContext = {
    canvasContext: context,
    viewport: viewport.value,
  };

  try {
    await page.value.render(renderContext).promise;
  } catch (error) {
    console.error("Error rendering page:", error);
  }
};

// Re-render when scale changes
watch(scale, () => {
  renderPage();
});

onMounted(() => {
  renderPage();
});
</script>

<style>
.lector-canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
