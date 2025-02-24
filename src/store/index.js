import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { appPrefix } from '../config'

const pinia = createPinia()

// 持久化插件
pinia.use(
  createPersistedState({
    key: (id) => appPrefix(id),
  })
)

export function setupPinia(app) {
  app.use(pinia)
}
