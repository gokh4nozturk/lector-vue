import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as pdfjsLib from 'pdfjs-dist'

// PDF.js worker yapılandırması
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
