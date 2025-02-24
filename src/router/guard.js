import { configItem } from '../config'
import { useUserStore } from '@/store/user'
import { ApiBase } from '@/api'
// import { useAlive, aliveRemove } from '@/hooks/useAlive'
// import { isBoolean } from "@/utils/helper/is";

export function useGuard(router) {
  router.beforeEach(async (to, from) => {
    const { meta, name, query, params } = to

    const { auth = true } = meta || {}

    const userStore = useUserStore()
    if (!auth) {
      if (name === 'Login' && userStore.token) {
        return from
      }
      return true
    }

    if (!userStore.token) {
      return 'Login'
    }
    // userStore.checkTokenExpire()
    /** 获取并更新用户信息 */
    await ApiBase.getInfoForPerson()
      .then((res) => {
        userStore.info = res?.data
      })
      .catch()

    return true
  })

  // 后置守卫
  router.afterEach(async (to, from) => {
    const { meta } = to
    let { title, removeAlive = false } = meta || {}

    title = meta.title || configItem('title')
    // 区分开发生产环境
    if (import.meta.env.DEV) {
      title = `DEV - ${title}`
    }

    document.title = title
  })
}
