<!-- TextLayer.vue -->
<template>
  <div :class="['lector-text-layer', className]" ref="textLayerRef"></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch } from "vue";
import * as PDFJS from 'pdfjs-dist';
import "pdfjs-dist/web/pdf_viewer.css";

interface Props {
  className?: string;
}

const props = defineProps<Props>();
const textLayerRef = ref<HTMLDivElement | null>(null);

// Inject dependencies from parent components
const page = inject("page");
const viewport = inject("viewport");
const scale = inject("scale", ref(1));

// Render text layer
const renderText = async () => {
  if (!page.value || !viewport.value || !textLayerRef.value) return;

  const textContent = await page.value.getTextContent();
  const textLayerDiv = textLayerRef.value;

  // Clear previous content
  textLayerDiv.innerHTML = "";

  try {
    await PDFJS.renderTextLayer({
      textContent,
      container: textLayerDiv,
      viewport: viewport.value,
      textDivs: [],
    });
  } catch (error) {
    console.error("Error rendering text layer:", error);
  }
};

// Re-render when scale changes
watch(scale, () => {
  renderText();
});

onMounted(() => {
  renderText();
});
</script>

<style>
.lector-text-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1;
}

.lector-text-layer > span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

.lector-text-layer ::selection {
  background: rgba(0, 0, 255, 0.2);
}

@media (prefers-color-scheme: dark) {
  .lector-text-layer ::selection {
    background: rgba(255, 255, 0, 0.2);
  }
}
</style>
