import type { App } from 'vue'
import LectorViewer from './components/LectorViewer.vue'

export { LectorViewer }

export default {
  install: (app: App) => {
    app.component('LectorViewer', LectorViewer)
  }
} 