<!-- Pages.vue -->
<template>
  <div :class="['lector-pages', className]" ref="pagesRef">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, provide } from "vue";

interface Props {
  className?: string;
  scale?: number;
  spacing?: number;
}

const props = defineProps<Props>();
const pagesRef = ref<HTMLDivElement | null>(null);
const scale = ref(props.scale || 1);
const spacing = ref(props.spacing || 8);

// Inject PDF document from Root component
const pdfDocument = inject("pdfDocument");

// Provide scale and spacing to child components
provide("scale", scale);
provide("spacing", spacing);

// Expose pages container ref to child components
defineExpose({
  pagesRef,
});
</script>

<style>
.lector-pages {
  position: relative;
  min-height: 100%;
  padding: var(--lector-spacing, 8px);
}
</style>
