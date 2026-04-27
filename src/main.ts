import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import { registerSW } from 'virtual:pwa-register'

import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const updateSW = registerSW({
  onNeedRefresh() {
    // We can show a prompt here. For now, it will auto-update based on config
  },
  onOfflineReady() {
    console.log('App is ready to work offline.')
  },
})

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(head)

app.mount('#app')
