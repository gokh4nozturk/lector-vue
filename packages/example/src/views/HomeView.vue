<script setup lang="ts">
import { ref } from 'vue'
import { LectorViewer } from '@lector-vue/core'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const pdfUrl = ref('https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf')
const scale = ref(1.0)
const pageNumber = ref(1)

function onDocumentLoad(pdf: PDFDocumentProxy) {
  console.log('PDF loaded:', pdf.numPages, 'pages')
}

function onPageChange(page: number) {
  console.log('Current page:', page)
  pageNumber.value = page
}

function onError(error: Error) {
  console.error('PDF error:', error)
}
</script>

<template>
  <main>
    <h1>Lector Vue Example</h1>
    <div class="pdf-container">
      <LectorViewer
        :url="pdfUrl"
        :scale="scale"
        :page-number="pageNumber"
        @document-load="onDocumentLoad"
        @page-change="onPageChange"
        @error="onError"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.pdf-container {
  width: 100%;
  height: 80vh;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
</style>
