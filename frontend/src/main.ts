import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import { APP_NAME } from '@/constants'

const OPEN_SOURCE_BANNER = `
  ${APP_NAME} — 文件快传 (box.new-king.com)
  Open Source: https://github.com/New-King/box-newking
`

console.info(OPEN_SOURCE_BANNER)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
