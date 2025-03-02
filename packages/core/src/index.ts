// Core components
export { default as Root } from './components/Root.vue'
export { default as Pages } from './components/Pages.vue'
export { default as Page } from './components/Page.vue'
export { default as CanvasLayer } from './components/CanvasLayer.vue'
export { default as TextLayer } from './components/TextLayer.vue'
export { default as Toolbar } from './components/Toolbar.vue'
export { default as Thumbnails } from './components/Thumbnails.vue'

// Types
export interface LectorOptions {
  source: string
  scale?: number
  spacing?: number
  className?: string
}

// Version
export const version = '0.1.0' 