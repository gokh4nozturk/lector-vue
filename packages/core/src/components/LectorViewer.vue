<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

const props = defineProps<{
  url: string
  scale?: number
  pageNumber?: number
}>()

const emit = defineEmits<{
  'page-change': [number]
  'document-load': [PDFDocumentProxy]
  'error': [Error]
}>()

const pdfDocument = ref<PDFDocumentProxy | null>(null)
const currentPage = ref<PDFPageProxy | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentPageNumber = ref(props.pageNumber || 1)
const currentScale = ref(props.scale || 1.0)
const totalPages = ref(0)

watch(() => props.pageNumber, (newPage) => {
  if (newPage && newPage !== currentPageNumber.value) {
    currentPageNumber.value = newPage
    renderPage()
  }
})

watch(() => props.scale, (newScale) => {
  if (newScale && newScale !== currentScale.value) {
    currentScale.value = newScale
    renderPage()
  }
})

onMounted(async () => {
  try {
    await loadDocument()
  } catch (error) {
    emit('error', error as Error)
  }
})

async function loadDocument() {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    const pdf = await pdfjsLib.getDocument(props.url).promise
    pdfDocument.value = pdf
    totalPages.value = pdf.numPages
    emit('document-load', pdf)
    await renderPage()
  } catch (error) {
    emit('error', error as Error)
  }
}

async function renderPage() {
  if (!pdfDocument.value || !canvasRef.value) return

  try {
    if (currentPage.value) {
      currentPage.value.cleanup()
    }

    const page = await pdfDocument.value.getPage(currentPageNumber.value)
    currentPage.value = page

    const viewport = page.getViewport({ scale: currentScale.value })
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas context not available')
    }

    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise

    emit('page-change', currentPageNumber.value)
  } catch (error) {
    emit('error', error as Error)
  }
}

async function nextPage() {
  if (currentPageNumber.value < totalPages.value) {
    currentPageNumber.value++
    await renderPage()
  }
}

async function previousPage() {
  if (currentPageNumber.value > 1) {
    currentPageNumber.value--
    await renderPage()
  }
}

async function zoomIn() {
  currentScale.value *= 1.1
  await renderPage()
}

async function zoomOut() {
  currentScale.value *= 0.9
  await renderPage()
}

defineExpose({
  nextPage,
  previousPage,
  zoomIn,
  zoomOut
})
</script>

<template>
  <div class="lector-viewer">
    <div class="toolbar">
      <button @click="previousPage" :disabled="currentPageNumber <= 1">
        Previous
      </button>
      <span>{{ currentPageNumber }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPageNumber >= totalPages">
        Next
      </button>
      <button @click="zoomOut">-</button>
      <button @click="zoomIn">+</button>
    </div>
    <div class="viewer">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.lector-viewer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.viewer {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  background-color: #e0e0e0;
  padding: 1rem;
}

canvas {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #2196f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1976d2;
}

button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}
</style> 