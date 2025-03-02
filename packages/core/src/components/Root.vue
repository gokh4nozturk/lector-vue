<!-- Root.vue -->
<template>
  <div :class="['lector-root', className]">
    <div v-if="loading" class="lector-loader">
      <slot name="loader">
        <div>Loading...</div>
      </slot>
    </div>
    <div v-else class="lector-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

interface Props {
  source: string
  className?: string
}

const props = defineProps<Props>()
const loading = ref(true)
const pdfDocument = ref<any>(null)

// PDF yüklendiğinde yayınlanacak olay
const emit = defineEmits<{
  (e: 'pdf-loaded', pdf: any): void
}>()

const loadPdf = async () => {
  try {
    const pdf = await pdfjsLib.getDocument(props.source).promise
    pdfDocument.value = pdf
    loading.value = false
    emit('pdf-loaded', pdf)
  } catch (error) {
    console.error('Error loading PDF:', error)
  }
}

onMounted(() => {
  loadPdf()
})

// Provide PDF document to child components
provide('pdfDocument', pdfDocument)
</script>

<style>
.lector-root {
  position: relative;
  width: 100%;
  height: 100%;
}

.lector-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.lector-content {
  height: 100%;
  overflow: auto;
}
</style>
