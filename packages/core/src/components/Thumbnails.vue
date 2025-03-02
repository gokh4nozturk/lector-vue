<!-- Thumbnails.vue -->
<template>
  <div :class="['lector-thumbnails', className]">
    <div class="thumbnails-header">Sayfalar</div>
    <div class="thumbnails-list" ref="listRef">
      <div
        v-for="pageNum in pageCount"
        :key="pageNum"
        :class="['thumbnail-item', { active: activePage === pageNum }]"
        @click="selectPage(pageNum)"
      >
        <div class="thumbnail-canvas-wrapper">
          <canvas :ref="(el) => setCanvasRef(el, pageNum)"></canvas>
        </div>
        <div class="thumbnail-label">{{ pageNum }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch } from "vue";

interface Props {
  className?: string;
  activePage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  activePage: 1
});
const listRef = ref<HTMLDivElement | null>(null);
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map());
const pageCount = ref(0);

// Inject PDF document from Root component
const pdfDocument = inject("pdfDocument");

const setCanvasRef = (el: HTMLCanvasElement | null, pageNum: number) => {
  if (el) {
    canvasRefs.value.set(pageNum, el);
  }
};

const renderThumbnail = async (pageNum: number) => {
  if (!pdfDocument.value) return;

  try {
    const page = await pdfDocument.value.getPage(pageNum);
    const canvas = canvasRefs.value.get(pageNum);

    if (!canvas) return;

    const viewport = page.getViewport({ scale: 0.2 }); // Küçük ölçek kullan
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");
    if (!context) return;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;
  } catch (error) {
    console.error(`Error rendering thumbnail for page ${pageNum}:`, error);
  }
};

const selectPage = (pageNum: number) => {
  // Sayfa seçildiğinde bir olay yayınla
  emit("pageSelected", pageNum);
};

const loadThumbnails = async () => {
  if (!pdfDocument.value) return;

  pageCount.value = pdfDocument.value.numPages;

  // Tüm küçük resimleri oluştur
  for (let i = 1; i <= pageCount.value; i++) {
    await renderThumbnail(i);
  }
};

// Sayfa seçildiğinde yayınlanacak olay
const emit = defineEmits<{
  (e: "pageSelected", pageNum: number): void;
}>();

onMounted(() => {
  loadThumbnails();
});

// PDF document değiştiğinde küçük resimleri yeniden yükle
watch(
  () => pdfDocument.value,
  () => {
    loadThumbnails();
  }
);
</script>

<style>
.lector-thumbnails {
  width: 200px;
  height: 100%;
  border-right: 1px solid #e2e8f0;
  background: white;
  display: flex;
  flex-direction: column;
}

.thumbnails-header {
  padding: 12px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.thumbnails-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.thumbnail-item {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.thumbnail-item:hover {
  background: #f8fafc;
}

.thumbnail-item.active {
  background: #e2e8f0;
}

.thumbnail-canvas-wrapper {
  width: 100%;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
}

.thumbnail-canvas-wrapper canvas {
  max-width: 100%;
  height: auto;
  border: 1px solid #e2e8f0;
  border-radius: 2px;
}

.thumbnail-label {
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

@media (prefers-color-scheme: dark) {
  .lector-thumbnails {
    background: #1a1a1a;
    border-color: #2d2d2d;
  }

  .thumbnails-header {
    color: #e2e8f0;
    border-color: #2d2d2d;
  }

  .thumbnail-item:hover {
    background: #2d2d2d;
  }

  .thumbnail-item.active {
    background: #374151;
  }

  .thumbnail-canvas-wrapper canvas {
    border-color: #2d2d2d;
  }

  .thumbnail-label {
    color: #94a3b8;
  }
}
</style>
