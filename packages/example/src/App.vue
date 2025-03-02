<script setup lang="ts">
import { Root, Pages, Page, CanvasLayer, TextLayer, Toolbar, Thumbnails } from '@lector-vue/core'
import { ref, onMounted } from 'vue'

const currentPage = ref(1)
const totalPages = ref(1)

const handlePageSelected = (pageNum: number) => {
  currentPage.value = pageNum
}

const handlePdfLoaded = (pdf: any) => {
  totalPages.value = pdf.numPages
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Lector Vue Example</h1>
    </header>
    <main>
      <Root source="/sample.pdf" class="pdf-viewer" @pdf-loaded="handlePdfLoaded">
        <template #loader>
          <div class="loader">Loading PDF...</div>
        </template>
        <div class="viewer-container">
          <Thumbnails :activePage="currentPage" @pageSelected="handlePageSelected" />
          <div class="viewer-content">
            <Toolbar />
            <Pages>
              <Page :pageNumber="currentPage">
                <CanvasLayer />
                <TextLayer />
              </Page>
            </Pages>
          </div>
        </div>
      </Root>
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

main {
  flex: 1;
}

.pdf-viewer {
  width: 100%;
  height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.viewer-container {
  display: flex;
  height: 100%;
}

.viewer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #64748b;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #e2e8f0;
  }

  h1 {
    color: #e2e8f0;
  }

  .pdf-viewer {
    border-color: #2d2d2d;
  }

  .loader {
    color: #94a3b8;
  }
}
</style>
