import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from './store'
import { setupRouter } from './router'

import 'virtual:uno.css'
import './styles/index.css'

function bootstrap() {
  const app = createApp(App)

  setupPinia(app)
  setupRouter(app)

  app.mount('#app')
}

bootstrap()
